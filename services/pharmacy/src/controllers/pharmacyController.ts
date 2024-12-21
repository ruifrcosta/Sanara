import { Request, Response, NextFunction } from 'express';
import { PharmacyService } from '../services/pharmacyService';
import { logger } from '../utils/logger';

const pharmacyService = new PharmacyService();

export class PharmacyController {
  async createPharmacy(req: Request, res: Response, next: NextFunction) {
    try {
      const pharmacy = await pharmacyService.createPharmacy(req.body);
      logger.info('Pharmacy created successfully');
      res.status(201).json(pharmacy);
    } catch (error) {
      next(error);
    }
  }

  async updatePharmacy(req: Request, res: Response, next: NextFunction) {
    try {
      const { pharmacyId } = req.params;
      const pharmacy = await pharmacyService.updatePharmacy(pharmacyId, req.body);
      logger.info('Pharmacy updated successfully');
      res.json(pharmacy);
    } catch (error) {
      next(error);
    }
  }

  async getPharmacy(req: Request, res: Response, next: NextFunction) {
    try {
      const { pharmacyId } = req.params;
      const pharmacy = await pharmacyService.getPharmacy(pharmacyId);
      logger.info('Pharmacy retrieved successfully');
      res.json(pharmacy);
    } catch (error) {
      next(error);
    }
  }

  async listPharmacies(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const filters = {
        status: req.query.status as any,
        city: req.query.city as string,
        state: req.query.state as string
      };

      const result = await pharmacyService.listPharmacies(page, limit, filters);
      logger.info('Pharmacies listed successfully');
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async searchNearbyPharmacies(req: Request, res: Response, next: NextFunction) {
    try {
      const { latitude, longitude, radius } = req.query;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await pharmacyService.searchNearbyPharmacies(
        parseFloat(latitude as string),
        parseFloat(longitude as string),
        radius ? parseFloat(radius as string) : undefined,
        page,
        limit
      );

      logger.info('Nearby pharmacies found successfully');
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
} 