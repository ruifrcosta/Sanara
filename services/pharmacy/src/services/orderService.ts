import { PrismaClient, PharmacyOrder, PharmacyOrderStatus, PharmacyOrderItemStatus } from '@prisma/client';
import { AppError } from '../middlewares/errorHandler';
import { logger } from '../utils/logger';
import { config } from '../config';
import { InventoryService } from './inventoryService';
import axios from 'axios';

const prisma = new PrismaClient();
const inventoryService = new InventoryService();

export interface CreatePharmacyOrderData {
  pharmacyId: string;
  orderId: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
}

export interface UpdatePharmacyOrderData {
  status?: PharmacyOrderStatus;
}

export class PharmacyOrderService {
  async createOrder(data: CreatePharmacyOrderData): Promise<PharmacyOrder> {
    try {
      // Check if order already exists
      const existingOrder = await prisma.pharmacyOrder.findUnique({
        where: { orderId: data.orderId }
      });

      if (existingOrder) {
        throw new AppError(400, 'Order already exists');
      }

      // Check inventory availability
      const isAvailable = await inventoryService.checkAvailability(
        data.pharmacyId,
        data.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      );

      if (!isAvailable) {
        throw new AppError(400, 'Some items are not available in the required quantity');
      }

      // Create order with items
      const order = await prisma.pharmacyOrder.create({
        data: {
          pharmacyId: data.pharmacyId,
          orderId: data.orderId,
          status: PharmacyOrderStatus.PENDING,
          items: {
            create: data.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              status: PharmacyOrderItemStatus.PENDING
            }))
          }
        },
        include: {
          items: true
        }
      });

      // Reserve inventory
      await inventoryService.reserveInventory(
        data.pharmacyId,
        data.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      );

      logger.info('Pharmacy order created successfully', {
        pharmacyId: data.pharmacyId,
        orderId: data.orderId
      });

      return order;
    } catch (error) {
      logger.error('Failed to create pharmacy order:', error);
      throw error;
    }
  }

  async updateOrder(
    pharmacyId: string,
    orderId: string,
    data: UpdatePharmacyOrderData
  ): Promise<PharmacyOrder> {
    try {
      const order = await this.getOrder(pharmacyId, orderId);

      // Validate status transition
      this.validateStatusTransition(order.status, data.status);

      // Update order
      const updatedOrder = await prisma.pharmacyOrder.update({
        where: {
          id: order.id
        },
        data: {
          status: data.status
        },
        include: {
          items: true
        }
      });

      // Handle status-specific actions
      if (data.status) {
        await this.handleStatusChange(updatedOrder);
      }

      logger.info('Pharmacy order updated successfully', {
        pharmacyId,
        orderId
      });

      return updatedOrder;
    } catch (error) {
      logger.error('Failed to update pharmacy order:', error);
      throw error;
    }
  }

  async getOrder(
    pharmacyId: string,
    orderId: string
  ): Promise<PharmacyOrder> {
    try {
      const order = await prisma.pharmacyOrder.findFirst({
        where: {
          pharmacyId,
          orderId
        },
        include: {
          items: true
        }
      });

      if (!order) {
        throw new AppError(404, 'Order not found');
      }

      return order;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Failed to get pharmacy order:', error);
      throw new AppError(500, 'Failed to get pharmacy order');
    }
  }

  async listPharmacyOrders(
    pharmacyId: string,
    page: number = 1,
    limit: number = config.pagination.defaultLimit,
    filters?: {
      status?: PharmacyOrderStatus;
      startDate?: Date;
      endDate?: Date;
    }
  ): Promise<{ orders: PharmacyOrder[]; total: number }> {
    try {
      const where = {
        pharmacyId,
        status: filters?.status,
        createdAt: {
          gte: filters?.startDate,
          lte: filters?.endDate
        }
      };

      const [orders, total] = await Promise.all([
        prisma.pharmacyOrder.findMany({
          where,
          include: {
            items: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          skip: (page - 1) * limit,
          take: limit
        }),
        prisma.pharmacyOrder.count({ where })
      ]);

      return { orders, total };
    } catch (error) {
      logger.error('Failed to list pharmacy orders:', error);
      throw new AppError(500, 'Failed to list pharmacy orders');
    }
  }

  async cancelOrder(pharmacyId: string, orderId: string): Promise<PharmacyOrder> {
    try {
      const order = await this.getOrder(pharmacyId, orderId);

      if (!this.canCancel(order.status)) {
        throw new AppError(400, 'Order cannot be cancelled in its current status');
      }

      // Update order status
      const updatedOrder = await prisma.pharmacyOrder.update({
        where: {
          id: order.id
        },
        data: {
          status: PharmacyOrderStatus.CANCELLED,
          items: {
            updateMany: {
              where: {
                status: PharmacyOrderItemStatus.PENDING
              },
              data: {
                status: PharmacyOrderItemStatus.CANCELLED
              }
            }
          }
        },
        include: {
          items: true
        }
      });

      // Release inventory for cancelled items
      await inventoryService.releaseInventory(
        pharmacyId,
        order.items
          .filter(item => item.status === PharmacyOrderItemStatus.PENDING)
          .map(item => ({
            productId: item.productId,
            quantity: item.quantity
          }))
      );

      // Notify order service about cancellation
      await this.notifyOrderService(orderId, 'CANCELLED');

      logger.info('Pharmacy order cancelled successfully', {
        pharmacyId,
        orderId
      });

      return updatedOrder;
    } catch (error) {
      logger.error('Failed to cancel pharmacy order:', error);
      throw error;
    }
  }

  private validateStatusTransition(currentStatus: PharmacyOrderStatus, newStatus?: PharmacyOrderStatus): void {
    if (!newStatus) return;

    const allowedTransitions: Record<PharmacyOrderStatus, PharmacyOrderStatus[]> = {
      PENDING: [PharmacyOrderStatus.CONFIRMED, PharmacyOrderStatus.CANCELLED],
      CONFIRMED: [PharmacyOrderStatus.PROCESSING, PharmacyOrderStatus.CANCELLED],
      PROCESSING: [PharmacyOrderStatus.READY_FOR_PICKUP, PharmacyOrderStatus.CANCELLED],
      READY_FOR_PICKUP: [PharmacyOrderStatus.COMPLETED, PharmacyOrderStatus.CANCELLED],
      COMPLETED: [],
      CANCELLED: []
    };

    if (!allowedTransitions[currentStatus].includes(newStatus)) {
      throw new AppError(400, `Cannot transition order from ${currentStatus} to ${newStatus}`);
    }
  }

  private async handleStatusChange(order: PharmacyOrder): Promise<void> {
    switch (order.status) {
      case PharmacyOrderStatus.CONFIRMED:
        await this.handleOrderConfirmed(order);
        break;
      case PharmacyOrderStatus.PROCESSING:
        await this.handleOrderProcessing(order);
        break;
      case PharmacyOrderStatus.READY_FOR_PICKUP:
        await this.handleOrderReadyForPickup(order);
        break;
      case PharmacyOrderStatus.COMPLETED:
        await this.handleOrderCompleted(order);
        break;
      case PharmacyOrderStatus.CANCELLED:
        await this.handleOrderCancelled(order);
        break;
    }
  }

  private async handleOrderConfirmed(order: PharmacyOrder): Promise<void> {
    await this.notifyOrderService(order.orderId, 'CONFIRMED');
  }

  private async handleOrderProcessing(order: PharmacyOrder): Promise<void> {
    await this.notifyOrderService(order.orderId, 'PROCESSING');
  }

  private async handleOrderReadyForPickup(order: PharmacyOrder): Promise<void> {
    await this.notifyOrderService(order.orderId, 'READY_FOR_PICKUP');
  }

  private async handleOrderCompleted(order: PharmacyOrder): Promise<void> {
    await this.notifyOrderService(order.orderId, 'COMPLETED');
  }

  private async handleOrderCancelled(order: PharmacyOrder): Promise<void> {
    await this.notifyOrderService(order.orderId, 'CANCELLED');
  }

  private async notifyOrderService(orderId: string, status: string): Promise<void> {
    try {
      await axios.post(`${config.services.orders}/orders/${orderId}/status`, {
        status,
        source: 'pharmacy'
      });
    } catch (error) {
      logger.error('Failed to notify order service:', error);
      // Don't throw error as this is a notification
    }
  }

  private canCancel(status: PharmacyOrderStatus): boolean {
    const cancellableStatuses = [
      PharmacyOrderStatus.PENDING,
      PharmacyOrderStatus.CONFIRMED,
      PharmacyOrderStatus.PROCESSING
    ];
    return cancellableStatuses.includes(status);
  }
} 