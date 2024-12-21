import { Request, Response, NextFunction } from 'express';
import { OrderService, CreateOrderData, UpdateOrderData } from '../services/orderService';
import { logger } from '../utils/logger';

const orderService = new OrderService();

export class OrderController {
  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const orderData: CreateOrderData = req.body;
      const order = await orderService.createOrder(orderData);
      
      logger.info('Order created successfully');
      res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  }

  async updateOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId } = req.params;
      const orderData: UpdateOrderData = req.body;
      const order = await orderService.updateOrder(orderId, orderData);
      
      logger.info('Order updated successfully');
      res.json(order);
    } catch (error) {
      next(error);
    }
  }

  async getOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId } = req.params;
      const order = await orderService.getOrder(orderId);
      
      logger.info('Order retrieved successfully');
      res.json(order);
    } catch (error) {
      next(error);
    }
  }

  async listUserOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      
      const result = await orderService.listUserOrders(userId, page, limit);
      
      logger.info('User orders listed successfully');
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async cancelOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId } = req.params;
      const order = await orderService.cancelOrder(orderId);
      
      logger.info('Order cancelled successfully');
      res.json(order);
    } catch (error) {
      next(error);
    }
  }
} 