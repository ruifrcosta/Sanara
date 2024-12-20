import { PrismaClient, PharmacyInventory, InventoryStatus } from '@prisma/client';
import { AppError } from '../middlewares/errorHandler';
import { logger } from '../utils/logger';
import { config } from '../config';
import axios from 'axios';

const prisma = new PrismaClient();

export interface CreateInventoryItemData {
  pharmacyId: string;
  productId: string;
  quantity: number;
  price: number;
}

export interface UpdateInventoryItemData {
  quantity?: number;
  price?: number;
  status?: InventoryStatus;
}

export interface BulkUpdateInventoryData {
  items: Array<{
    productId: string;
    quantity: number;
    price?: number;
  }>;
}

export class InventoryService {
  async addInventoryItem(data: CreateInventoryItemData): Promise<PharmacyInventory> {
    try {
      // Validate product exists
      await this.validateProduct(data.productId);

      // Check if item already exists
      const existingItem = await prisma.pharmacyInventory.findUnique({
        where: {
          pharmacyId_productId: {
            pharmacyId: data.pharmacyId,
            productId: data.productId
          }
        }
      });

      if (existingItem) {
        throw new AppError(400, 'Product already exists in inventory');
      }

      // Create inventory item
      const inventoryItem = await prisma.pharmacyInventory.create({
        data: {
          pharmacyId: data.pharmacyId,
          productId: data.productId,
          quantity: data.quantity,
          price: data.price,
          status: data.quantity > 0 ? InventoryStatus.ACTIVE : InventoryStatus.OUT_OF_STOCK
        }
      });

      logger.info('Inventory item added successfully', {
        pharmacyId: data.pharmacyId,
        productId: data.productId
      });

      return inventoryItem;
    } catch (error) {
      logger.error('Failed to add inventory item:', error);
      throw error;
    }
  }

  async updateInventoryItem(
    pharmacyId: string,
    productId: string,
    data: UpdateInventoryItemData
  ): Promise<PharmacyInventory> {
    try {
      const inventoryItem = await prisma.pharmacyInventory.findUnique({
        where: {
          pharmacyId_productId: {
            pharmacyId,
            productId
          }
        }
      });

      if (!inventoryItem) {
        throw new AppError(404, 'Inventory item not found');
      }

      // Update inventory item
      const updatedItem = await prisma.pharmacyInventory.update({
        where: {
          pharmacyId_productId: {
            pharmacyId,
            productId
          }
        },
        data: {
          quantity: data.quantity,
          price: data.price,
          status: this.determineStatus(data.quantity ?? inventoryItem.quantity, data.status)
        }
      });

      logger.info('Inventory item updated successfully', {
        pharmacyId,
        productId
      });

      return updatedItem;
    } catch (error) {
      logger.error('Failed to update inventory item:', error);
      throw error;
    }
  }

  async bulkUpdateInventory(
    pharmacyId: string,
    data: BulkUpdateInventoryData
  ): Promise<PharmacyInventory[]> {
    try {
      const updates = data.items.map(item =>
        prisma.pharmacyInventory.upsert({
          where: {
            pharmacyId_productId: {
              pharmacyId,
              productId: item.productId
            }
          },
          update: {
            quantity: item.quantity,
            price: item.price,
            status: this.determineStatus(item.quantity)
          },
          create: {
            pharmacyId,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price ?? 0,
            status: this.determineStatus(item.quantity)
          }
        })
      );

      const updatedItems = await prisma.$transaction(updates);

      logger.info('Bulk inventory update completed successfully', {
        pharmacyId,
        itemCount: data.items.length
      });

      return updatedItems;
    } catch (error) {
      logger.error('Failed to bulk update inventory:', error);
      throw error;
    }
  }

  async getInventoryItem(
    pharmacyId: string,
    productId: string
  ): Promise<PharmacyInventory> {
    try {
      const inventoryItem = await prisma.pharmacyInventory.findUnique({
        where: {
          pharmacyId_productId: {
            pharmacyId,
            productId
          }
        }
      });

      if (!inventoryItem) {
        throw new AppError(404, 'Inventory item not found');
      }

      return inventoryItem;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Failed to get inventory item:', error);
      throw new AppError(500, 'Failed to get inventory item');
    }
  }

  async listPharmacyInventory(
    pharmacyId: string,
    page: number = 1,
    limit: number = config.pagination.defaultLimit,
    filters?: {
      status?: InventoryStatus;
      minQuantity?: number;
      maxQuantity?: number;
    }
  ): Promise<{ items: PharmacyInventory[]; total: number }> {
    try {
      const where = {
        pharmacyId,
        status: filters?.status,
        quantity: {
          gte: filters?.minQuantity,
          lte: filters?.maxQuantity
        }
      };

      const [items, total] = await Promise.all([
        prisma.pharmacyInventory.findMany({
          where,
          orderBy: [
            { status: 'asc' },
            { quantity: 'desc' }
          ],
          skip: (page - 1) * limit,
          take: limit
        }),
        prisma.pharmacyInventory.count({ where })
      ]);

      return { items, total };
    } catch (error) {
      logger.error('Failed to list pharmacy inventory:', error);
      throw new AppError(500, 'Failed to list pharmacy inventory');
    }
  }

  async checkAvailability(
    pharmacyId: string,
    items: Array<{ productId: string; quantity: number }>
  ): Promise<boolean> {
    try {
      const inventoryItems = await prisma.pharmacyInventory.findMany({
        where: {
          pharmacyId,
          productId: {
            in: items.map(item => item.productId)
          }
        }
      });

      // Create a map for easier lookup
      const inventoryMap = new Map(
        inventoryItems.map(item => [item.productId, item])
      );

      // Check if all items are available in required quantities
      return items.every(item => {
        const inventoryItem = inventoryMap.get(item.productId);
        return (
          inventoryItem &&
          inventoryItem.status === InventoryStatus.ACTIVE &&
          inventoryItem.quantity >= item.quantity
        );
      });
    } catch (error) {
      logger.error('Failed to check availability:', error);
      throw new AppError(500, 'Failed to check inventory availability');
    }
  }

  async reserveInventory(
    pharmacyId: string,
    items: Array<{ productId: string; quantity: number }>
  ): Promise<void> {
    try {
      const updates = items.map(item =>
        prisma.pharmacyInventory.update({
          where: {
            pharmacyId_productId: {
              pharmacyId,
              productId: item.productId
            }
          },
          data: {
            quantity: {
              decrement: item.quantity
            }
          }
        })
      );

      await prisma.$transaction(updates);

      logger.info('Inventory reserved successfully', {
        pharmacyId,
        items
      });
    } catch (error) {
      logger.error('Failed to reserve inventory:', error);
      throw new AppError(500, 'Failed to reserve inventory');
    }
  }

  async releaseInventory(
    pharmacyId: string,
    items: Array<{ productId: string; quantity: number }>
  ): Promise<void> {
    try {
      const updates = items.map(item =>
        prisma.pharmacyInventory.update({
          where: {
            pharmacyId_productId: {
              pharmacyId,
              productId: item.productId
            }
          },
          data: {
            quantity: {
              increment: item.quantity
            }
          }
        })
      );

      await prisma.$transaction(updates);

      logger.info('Inventory released successfully', {
        pharmacyId,
        items
      });
    } catch (error) {
      logger.error('Failed to release inventory:', error);
      throw new AppError(500, 'Failed to release inventory');
    }
  }

  private determineStatus(quantity: number, status?: InventoryStatus): InventoryStatus {
    if (status === InventoryStatus.INACTIVE) return InventoryStatus.INACTIVE;
    return quantity > 0 ? InventoryStatus.ACTIVE : InventoryStatus.OUT_OF_STOCK;
  }

  private async validateProduct(productId: string): Promise<void> {
    try {
      const response = await axios.get(`${config.services.products}/products/${productId}`);
      if (!response.data) {
        throw new AppError(400, 'Product not found');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new AppError(400, 'Product not found');
      }
      throw error;
    }
  }
} 