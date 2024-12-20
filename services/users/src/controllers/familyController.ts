import { Request, Response, NextFunction } from 'express';
import { FamilyService, CreateFamilyData, UpdateFamilyData, AddFamilyMemberData } from '../services/familyService';
import { logger } from '../utils/logger';

const familyService = new FamilyService();

export class FamilyController {
  async createFamily(req: Request, res: Response, next: NextFunction) {
    try {
      const familyData: CreateFamilyData = req.body;
      const family = await familyService.createFamily(familyData);
      
      logger.info('Family created successfully');
      res.status(201).json(family);
    } catch (error) {
      next(error);
    }
  }

  async updateFamily(req: Request, res: Response, next: NextFunction) {
    try {
      const familyId = req.params.familyId;
      const familyData: UpdateFamilyData = req.body;
      const family = await familyService.updateFamily(familyId, familyData);
      
      logger.info('Family updated successfully');
      res.json(family);
    } catch (error) {
      next(error);
    }
  }

  async getFamily(req: Request, res: Response, next: NextFunction) {
    try {
      const familyId = req.params.familyId;
      const family = await familyService.getFamily(familyId);
      
      logger.info('Family retrieved successfully');
      res.json(family);
    } catch (error) {
      next(error);
    }
  }

  async deleteFamily(req: Request, res: Response, next: NextFunction) {
    try {
      const familyId = req.params.familyId;
      await familyService.deleteFamily(familyId);
      
      logger.info('Family deleted successfully');
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async addFamilyMember(req: Request, res: Response, next: NextFunction) {
    try {
      const familyId = req.params.familyId;
      const memberData: AddFamilyMemberData = req.body;
      const member = await familyService.addFamilyMember(familyId, memberData);
      
      logger.info('Family member added successfully');
      res.status(201).json(member);
    } catch (error) {
      next(error);
    }
  }

  async removeFamilyMember(req: Request, res: Response, next: NextFunction) {
    try {
      const familyId = req.params.familyId;
      const userId = req.params.userId;
      await familyService.removeFamilyMember(familyId, userId);
      
      logger.info('Family member removed successfully');
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async listFamilies(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await familyService.listFamilies(page, limit);
      
      logger.info('Families listed successfully');
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
} 