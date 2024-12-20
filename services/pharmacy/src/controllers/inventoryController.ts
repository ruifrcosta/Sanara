import { Request, Response, NextFunction } from 'express';
import { InventoryService } from '../services/inventoryService';
import { logger } from '../utils/logger';

const inventoryService = new InventoryService();

export class InventoryController {
  async addInventoryItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { pharmacyId } = req.params;
      const inventoryItem = await inventoryService.addInventoryItem({
        pharmacyId,
        ...req.body
      });
      
      logger.info('Inventory item added successfully');
      res.status(201).json(inventoryItem);
    } catch (error) {
      next(error);
    }
  }

  async updateInventoryItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { pharmacyId, productId } = req.params;
      const inventoryItem = await inventoryService.updateInventoryItem(
        pharmacyId,
        productId,
        req.body
      );
      
      logger.info('Inventory item updated successfully');
      res.json(inventoryItem);
    } catch (error) {
      next(error);
    }
  }

  async bulkUpdateInventory(req: Request, res: Response, next: NextFunction) {
    try {
      const { pharmacyId } = req.params;
      const items = await inventoryService.bulkUpdateInventory(pharmacyId, req.body);
      
      logger.info('Bulk inventory update completed successfully');
      res.json(items);
    } catch (error) {
      next(error);
    }
  }

  async getInventoryItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { pharmacyId, productId } = req.params;
      const inventoryItem = await inventoryService.getInventoryItem(pharmacyId, productId);
      
      logger.info('Inventory item retrieved successfully');
      res.json(inventoryItem);
    } catch (error) {
      next(error);
    }
  }

  async listPharmacyInventory(req: Request, res: Response, next: NextFunction) {
    try {
      const { pharmacyId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const filters = {
        status: req.query.status as any,
        minQuantity: req.query.minQuantity ? parseInt(req.query.minQuantity as string) : undefined,
        maxQuantity: req.query.maxQuantity ? parseInt(req.query.maxQuantity as string) : undefined
      };

      const result = await inventoryService.listPharmacyInventory(
        pharmacyId,
        page,
        limit,
        filters
      );
      
      logger.info('Pharmacy inventory listed successfully');
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async checkAvailability(req: Request, res: Response, next: NextFunction) {
    try {
      const { pharmacyId } = req.params;
      const isAvailable = await inventoryService.checkAvailability(
        pharmacyId,
        req.body.items
      );
      
      logger.info('Availability check completed successfully');
      res.json({ available: isAvailable });
    } catch (error) {
      next(error);
    }
  }
} 