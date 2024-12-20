import { Request, Response, NextFunction } from 'express';
import { PrescriptionService } from '../services/prescriptionService';
import { logger } from '../utils/logger';

const prescriptionService = new PrescriptionService();

export class PrescriptionController {
  async createPrescription(req: Request, res: Response, next: NextFunction) {
    try {
      const prescription = await prescriptionService.createPrescription(req.body);
      
      logger.info('Prescription created successfully');
      res.status(201).json(prescription);
    } catch (error) {
      next(error);
    }
  }

  async updatePrescription(req: Request, res: Response, next: NextFunction) {
    try {
      const { prescriptionId } = req.params;
      const prescription = await prescriptionService.updatePrescription(prescriptionId, req.body);
      
      logger.info('Prescription updated successfully');
      res.json(prescription);
    } catch (error) {
      next(error);
    }
  }

  async getPrescription(req: Request, res: Response, next: NextFunction) {
    try {
      const { prescriptionId } = req.params;
      const prescription = await prescriptionService.getPrescription(prescriptionId);
      
      logger.info('Prescription retrieved successfully');
      res.json(prescription);
    } catch (error) {
      next(error);
    }
  }

  async listUserPrescriptions(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      
      const result = await prescriptionService.listUserPrescriptions(userId, page, limit);
      
      logger.info('User prescriptions listed successfully');
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async listPharmacyPrescriptions(req: Request, res: Response, next: NextFunction) {
    try {
      const { pharmacyId } = req.params;
      const { status } = req.query;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      
      const result = await prescriptionService.listPharmacyPrescriptions(
        pharmacyId,
        status as any,
        page,
        limit
      );
      
      logger.info('Pharmacy prescriptions listed successfully');
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
} 