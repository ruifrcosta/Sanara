import { Request, Response, NextFunction } from 'express';
import { UserService, CreateUserData, UpdateUserData } from '../services/userService';
import { logger } from '../utils/logger';

const userService = new UserService();

export class UserController {
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userData: CreateUserData = req.body;
      const user = await userService.createUser(userData);
      
      logger.info('User created successfully');
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      const userData: UpdateUserData = req.body;
      const user = await userService.updateUser(userId, userData);
      
      logger.info('User updated successfully');
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      const user = await userService.getUser(userId);
      
      logger.info('User retrieved successfully');
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      await userService.deleteUser(userId);
      
      logger.info('User deleted successfully');
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async listUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await userService.listUsers(page, limit);
      
      logger.info('Users listed successfully');
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
} 