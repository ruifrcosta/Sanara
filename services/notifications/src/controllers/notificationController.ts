import { Request, Response, NextFunction } from 'express';
import { NotificationService, CreateNotificationData } from '../services/notificationService';
import { logger } from '../utils/logger';

const notificationService = new NotificationService();

export class NotificationController {
  async createNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const notificationData: CreateNotificationData = req.body;
      const notification = await notificationService.createNotification(notificationData);
      
      logger.info('Notification created successfully');
      res.status(201).json(notification);
    } catch (error) {
      next(error);
    }
  }

  async getNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const notificationId = req.params.notificationId;
      const notification = await notificationService.getNotification(notificationId);
      
      logger.info('Notification retrieved successfully');
      res.json(notification);
    } catch (error) {
      next(error);
    }
  }

  async listUserNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      const notifications = await notificationService.listUserNotifications(userId);
      
      logger.info('User notifications listed successfully');
      res.json(notifications);
    } catch (error) {
      next(error);
    }
  }
} 