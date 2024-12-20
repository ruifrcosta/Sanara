import { PrismaClient, Order, OrderStatus, AddressType, PaymentMethod } from '@prisma/client';
import { AppError } from '../middlewares/errorHandler';
import { logger } from '../utils/logger';
import { config } from '../config';
import axios from 'axios';

const prisma = new PrismaClient();

export interface CreateOrderData {
  userId: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  shippingAddress: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  billingAddress?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface UpdateOrderData {
  status?: OrderStatus;
  notes?: string;
}

export class OrderService {
  async createOrder(data: CreateOrderData): Promise<Order> {
    try {
      // Validate products and get their details
      const products = await this.validateAndGetProducts(data.items);

      // Calculate order totals
      const { subtotal, tax, shipping, total } = this.calculateOrderTotals(products);

      // Create order with all related data
      const order = await prisma.order.create({
        data: {
          userId: data.userId,
          status: OrderStatus.PENDING,
          subtotal,
          tax,
          shipping,
          total,
          notes: data.notes,
          items: {
            create: products.map(product => ({
              productId: product.id,
              name: product.name,
              price: product.price,
              quantity: product.quantity,
              total: product.price * product.quantity
            }))
          },
          shippingAddress: {
            create: {
              type: AddressType.SHIPPING,
              ...data.shippingAddress
            }
          },
          billingAddress: data.billingAddress ? {
            create: {
              type: AddressType.BILLING,
              ...data.billingAddress
            }
          } : undefined,
          payment: {
            create: {
              status: 'PENDING',
              method: data.paymentMethod,
              amount: total,
              currency: 'BRL'
            }
          }
        },
        include: {
          items: true,
          shippingAddress: true,
          billingAddress: true,
          payment: true
        }
      });

      // Publish order created event
      await this.publishOrderEvent('order.created', order);

      logger.info('Order created successfully', { orderId: order.id });
      return order;
    } catch (error) {
      logger.error('Failed to create order:', error);
      throw error;
    }
  }

  async updateOrder(orderId: string, data: UpdateOrderData): Promise<Order> {
    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          items: true,
          payment: true
        }
      });

      if (!order) {
        throw new AppError(404, 'Order not found');
      }

      // Validate status transition
      if (data.status) {
        this.validateStatusTransition(order.status, data.status);
      }

      // Update order
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          status: data.status,
          notes: data.notes,
          updatedAt: new Date()
        },
        include: {
          items: true,
          shippingAddress: true,
          billingAddress: true,
          payment: true
        }
      });

      // Publish order updated event
      await this.publishOrderEvent('order.updated', updatedOrder);

      // Handle status-specific actions
      if (data.status) {
        await this.handleStatusChange(updatedOrder);
      }

      logger.info('Order updated successfully', { orderId });
      return updatedOrder;
    } catch (error) {
      logger.error('Failed to update order:', error);
      throw error;
    }
  }

  async getOrder(orderId: string): Promise<Order> {
    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          items: true,
          shippingAddress: true,
          billingAddress: true,
          payment: true
        }
      });

      if (!order) {
        throw new AppError(404, 'Order not found');
      }

      return order;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Failed to get order:', error);
      throw new AppError(500, 'Failed to get order');
    }
  }

  async listUserOrders(userId: string, page: number = 1, limit: number = 20): Promise<{ orders: Order[]; total: number }> {
    try {
      const [orders, total] = await Promise.all([
        prisma.order.findMany({
          where: { userId },
          include: {
            items: true,
            shippingAddress: true,
            billingAddress: true,
            payment: true
          },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit
        }),
        prisma.order.count({ where: { userId } })
      ]);

      return { orders, total };
    } catch (error) {
      logger.error('Failed to list user orders:', error);
      throw new AppError(500, 'Failed to list orders');
    }
  }

  async cancelOrder(orderId: string): Promise<Order> {
    try {
      const order = await this.getOrder(orderId);

      if (!this.canCancel(order.status)) {
        throw new AppError(400, 'Order cannot be cancelled in its current status');
      }

      const updatedOrder = await this.updateOrder(orderId, { status: OrderStatus.CANCELLED });

      // Handle cancellation-specific actions (refund, inventory update, etc.)
      await this.handleCancellation(updatedOrder);

      return updatedOrder;
    } catch (error) {
      logger.error('Failed to cancel order:', error);
      throw error;
    }
  }

  private async validateAndGetProducts(items: Array<{ productId: string; quantity: number }>) {
    try {
      const productsResponse = await axios.post(`${config.services.products}/validate-products`, {
        items: items.map(item => ({
          id: item.productId,
          quantity: item.quantity
        }))
      });

      return productsResponse.data.products.map((product: any, index: number) => ({
        ...product,
        quantity: items[index].quantity
      }));
    } catch (error) {
      logger.error('Failed to validate products:', error);
      throw new AppError(400, 'Invalid products in order');
    }
  }

  private calculateOrderTotals(products: any[]) {
    const subtotal = products.reduce((sum, product) => 
      sum + (product.price * product.quantity), 0
    );

    const tax = config.tax.includeInTotal ? subtotal * config.tax.rate : 0;
    const shipping = subtotal >= config.shipping.freeShippingThreshold ? 
      0 : config.shipping.baseRate;

    return {
      subtotal,
      tax,
      shipping,
      total: subtotal + tax + shipping
    };
  }

  private validateStatusTransition(currentStatus: OrderStatus, newStatus: OrderStatus) {
    const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
      PENDING: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      CONFIRMED: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
      PROCESSING: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
      SHIPPED: [OrderStatus.DELIVERED, OrderStatus.CANCELLED],
      DELIVERED: [OrderStatus.REFUNDED],
      CANCELLED: [],
      REFUNDED: []
    };

    if (!allowedTransitions[currentStatus].includes(newStatus)) {
      throw new AppError(400, `Cannot transition order from ${currentStatus} to ${newStatus}`);
    }
  }

  private async handleStatusChange(order: Order) {
    switch (order.status) {
      case OrderStatus.CONFIRMED:
        await this.handleOrderConfirmed(order);
        break;
      case OrderStatus.PROCESSING:
        await this.handleOrderProcessing(order);
        break;
      case OrderStatus.SHIPPED:
        await this.handleOrderShipped(order);
        break;
      case OrderStatus.DELIVERED:
        await this.handleOrderDelivered(order);
        break;
      case OrderStatus.CANCELLED:
        await this.handleOrderCancelled(order);
        break;
      case OrderStatus.REFUNDED:
        await this.handleOrderRefunded(order);
        break;
    }
  }

  private async handleOrderConfirmed(order: Order) {
    // Update inventory
    await this.updateInventory(order);
    // Send confirmation notification
    await this.sendNotification(order, 'ORDER_CONFIRMED');
  }

  private async handleOrderProcessing(order: Order) {
    // Send processing notification
    await this.sendNotification(order, 'ORDER_PROCESSING');
  }

  private async handleOrderShipped(order: Order) {
    // Send shipping notification with tracking info
    await this.sendNotification(order, 'ORDER_SHIPPED');
  }

  private async handleOrderDelivered(order: Order) {
    // Send delivery confirmation
    await this.sendNotification(order, 'ORDER_DELIVERED');
  }

  private async handleOrderCancelled(order: Order) {
    // Restore inventory
    await this.restoreInventory(order);
    // Process refund if payment was made
    if (order.payment?.status === 'COMPLETED') {
      await this.processRefund(order);
    }
    // Send cancellation notification
    await this.sendNotification(order, 'ORDER_CANCELLED');
  }

  private async handleOrderRefunded(order: Order) {
    // Send refund notification
    await this.sendNotification(order, 'ORDER_REFUNDED');
  }

  private async handleCancellation(order: Order) {
    // Restore inventory
    await this.restoreInventory(order);
    // Process refund if payment was made
    if (order.payment?.status === 'COMPLETED') {
      await this.processRefund(order);
    }
    // Send cancellation notification
    await this.sendNotification(order, 'ORDER_CANCELLED');
  }

  private async updateInventory(order: Order) {
    try {
      await axios.post(`${config.services.products}/update-inventory`, {
        items: order.items.map(item => ({
          productId: item.productId,
          quantity: -item.quantity // Decrease inventory
        }))
      });
    } catch (error) {
      logger.error('Failed to update inventory:', error);
      throw new AppError(500, 'Failed to update inventory');
    }
  }

  private async restoreInventory(order: Order) {
    try {
      await axios.post(`${config.services.products}/update-inventory`, {
        items: order.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity // Restore inventory
        }))
      });
    } catch (error) {
      logger.error('Failed to restore inventory:', error);
      throw new AppError(500, 'Failed to restore inventory');
    }
  }

  private async processRefund(order: Order) {
    try {
      await axios.post(`${config.services.payments}/refund`, {
        orderId: order.id,
        amount: order.total
      });
    } catch (error) {
      logger.error('Failed to process refund:', error);
      throw new AppError(500, 'Failed to process refund');
    }
  }

  private async sendNotification(order: Order, type: string) {
    try {
      await axios.post(`${config.services.notifications}/send`, {
        userId: order.userId,
        type: 'ORDER_NOTIFICATION',
        template: type,
        data: {
          orderId: order.id,
          total: order.total,
          items: order.items
        }
      });
    } catch (error) {
      logger.error('Failed to send notification:', error);
      // Don't throw error for notifications
    }
  }

  private async publishOrderEvent(event: string, order: Order) {
    try {
      // Implementation will depend on the message queue setup
      logger.info('Order event published', { event, orderId: order.id });
    } catch (error) {
      logger.error('Failed to publish order event:', error);
      // Don't throw error for events
    }
  }

  private canCancel(status: OrderStatus): boolean {
    const cancellableStatuses = [
      OrderStatus.PENDING,
      OrderStatus.CONFIRMED,
      OrderStatus.PROCESSING
    ];
    return cancellableStatuses.includes(status);
  }
} 