import { Request, Response, NextFunction } from 'express';
import { PharmacyOrderService } from '../services/orderService';
import { logger } from '../utils/logger';

const orderService = new PharmacyOrderService();

export class PharmacyOrderController {
  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { pharmacyId } = req.params;
      const order = await orderService.createOrder({
        pharmacyId,
        ...req.body
      });
      
      logger.info('Pharmacy order created successfully');
      res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  }

  async updateOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { pharmacyId, orderId } = req.params;
      const order = await orderService.updateOrder(pharmacyId, orderId, req.body);
      
      logger.info('Pharmacy order updated successfully');
      res.json(order);
    } catch (error) {
      next(error);
    }
  }

  async getOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { pharmacyId, orderId } = req.params;
      const order = await orderService.getOrder(pharmacyId, orderId);
      
      logger.info('Pharmacy order retrieved successfully');
      res.json(order);
    } catch (error) {
      next(error);
    }
  }

  async listPharmacyOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const { pharmacyId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const filters = {
        status: req.query.status as any,
        startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
        endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined
      };

      const result = await orderService.listPharmacyOrders(
        pharmacyId,
        page,
        limit,
        filters
      );
      
      logger.info('Pharmacy orders listed successfully');
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async cancelOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { pharmacyId, orderId } = req.params;
      const order = await orderService.cancelOrder(pharmacyId, orderId);
      
      logger.info('Pharmacy order cancelled successfully');
      res.json(order);
    } catch (error) {
      next(error);
    }
  }
} 