import { Request, Response, NextFunction } from 'express';
import { PreferenceService } from '../services/preferenceService';
import { logger } from '../utils/logger';

const preferenceService = new PreferenceService();

export class PreferenceController {
  async getPreferences(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      const preferences = await preferenceService.getPreferences(userId);
      
      logger.info('Preferences retrieved successfully');
      res.json(preferences);
    } catch (error) {
      next(error);
    }
  }

  async updatePreferences(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      const preferences = await preferenceService.updatePreferences(userId, req.body);
      
      logger.info('Preferences updated successfully');
      res.json(preferences);
    } catch (error) {
      next(error);
    }
  }

  async updateFCMToken(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      const { fcmToken } = req.body;
      const preferences = await preferenceService.updateFCMToken(userId, fcmToken);
      
      logger.info('FCM token updated successfully');
      res.json(preferences);
    } catch (error) {
      next(error);
    }
  }

  async verifyPhoneNumber(req: Request, res: Response, next: NextFunction) {
    try {
      const { phoneNumber } = req.body;
      const result = await preferenceService.verifyPhoneNumber(phoneNumber);
      
      logger.info('Phone number verified successfully');
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
} 