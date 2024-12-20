import { Request, Response, NextFunction } from 'express';
import { AuthService, LoginCredentials, RegisterData } from '../services/authService';
import { logger } from '../utils/logger';

const authService = new AuthService();

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const credentials: LoginCredentials = req.body;
      const result = await authService.login(credentials);
      
      logger.info('User logged in successfully');
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const userData: RegisterData = req.body;
      const result = await authService.register(userData);
      
      logger.info('User registered successfully');
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getUserInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      const result = await authService.getUserInfo(userId);
      
      logger.info('User info retrieved successfully');
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateUserInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      const userData: Partial<RegisterData> = req.body;
      const result = await authService.updateUserInfo(userId, userData);
      
      logger.info('User info updated successfully');
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
} 