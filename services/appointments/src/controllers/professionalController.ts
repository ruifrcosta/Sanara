import { Request, Response, NextFunction } from 'express';
import { ProfessionalService, CreateProfessionalData, UpdateProfessionalData, UpdateAvailabilityData } from '../services/professionalService';
import { logger } from '../utils/logger';

const professionalService = new ProfessionalService();

export class ProfessionalController {
  async createProfessional(req: Request, res: Response, next: NextFunction) {
    try {
      const professionalData: CreateProfessionalData = req.body;
      const professional = await professionalService.createProfessional(professionalData);
      
      logger.info('Professional created successfully');
      res.status(201).json(professional);
    } catch (error) {
      next(error);
    }
  }

  async updateProfessional(req: Request, res: Response, next: NextFunction) {
    try {
      const professionalId = req.params.professionalId;
      const professionalData: UpdateProfessionalData = req.body;
      const professional = await professionalService.updateProfessional(professionalId, professionalData);
      
      logger.info('Professional updated successfully');
      res.json(professional);
    } catch (error) {
      next(error);
    }
  }

  async getProfessional(req: Request, res: Response, next: NextFunction) {
    try {
      const professionalId = req.params.professionalId;
      const professional = await professionalService.getProfessional(professionalId);
      
      logger.info('Professional retrieved successfully');
      res.json(professional);
    } catch (error) {
      next(error);
    }
  }

  async listProfessionals(req: Request, res: Response, next: NextFunction) {
    try {
      const speciality = req.query.speciality as string | undefined;
      const professionals = await professionalService.listProfessionals(speciality);
      
      logger.info('Professionals listed successfully');
      res.json(professionals);
    } catch (error) {
      next(error);
    }
  }

  async updateAvailability(req: Request, res: Response, next: NextFunction) {
    try {
      const professionalId = req.params.professionalId;
      const availabilityData: UpdateAvailabilityData[] = req.body;
      const professional = await professionalService.updateAvailability(professionalId, availabilityData);
      
      logger.info('Professional availability updated successfully');
      res.json(professional);
    } catch (error) {
      next(error);
    }
  }

  async getAvailableSlots(req: Request, res: Response, next: NextFunction) {
    try {
      const professionalId = req.params.professionalId;
      const date = new Date(req.query.date as string);
      const slots = await professionalService.getAvailableSlots(professionalId, date);
      
      logger.info('Available slots retrieved successfully');
      res.json(slots);
    } catch (error) {
      next(error);
    }
  }
} 