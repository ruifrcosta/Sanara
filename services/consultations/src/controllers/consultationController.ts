import { Request, Response, NextFunction } from 'express';
import { ConsultationService, StartConsultationData, UpdateConsultationData } from '../services/consultationService';
import { AIService } from '../ai/aiService';
import { logger } from '../utils/logger';

const consultationService = new ConsultationService();
const aiService = new AIService();

export class ConsultationController {
  async startConsultation(req: Request, res: Response, next: NextFunction) {
    try {
      const consultationData: StartConsultationData = req.body;
      const consultation = await consultationService.startConsultation(consultationData);
      
      logger.info('Consultation started successfully');
      res.status(201).json(consultation);
    } catch (error) {
      next(error);
    }
  }

  async updateConsultation(req: Request, res: Response, next: NextFunction) {
    try {
      const consultationId = req.params.consultationId;
      const consultationData: UpdateConsultationData = req.body;
      const consultation = await consultationService.updateConsultation(consultationId, consultationData);
      
      logger.info('Consultation updated successfully');
      res.json(consultation);
    } catch (error) {
      next(error);
    }
  }

  async getConsultation(req: Request, res: Response, next: NextFunction) {
    try {
      const consultationId = req.params.consultationId;
      const consultation = await consultationService.getConsultation(consultationId);
      
      logger.info('Consultation retrieved successfully');
      res.json(consultation);
    } catch (error) {
      next(error);
    }
  }

  async listUserConsultations(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      const consultations = await consultationService.listUserConsultations(userId);
      
      logger.info('User consultations listed successfully');
      res.json(consultations);
    } catch (error) {
      next(error);
    }
  }

  async listProfessionalConsultations(req: Request, res: Response, next: NextFunction) {
    try {
      const professionalId = req.params.professionalId;
      const consultations = await consultationService.listProfessionalConsultations(professionalId);
      
      logger.info('Professional consultations listed successfully');
      res.json(consultations);
    } catch (error) {
      next(error);
    }
  }

  async generateVideoToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { consultationId } = req.params;
      const { userId } = req.body;
      const tokenData = await consultationService.generateVideoToken(consultationId, userId);
      
      logger.info('Video token generated successfully');
      res.json(tokenData);
    } catch (error) {
      next(error);
    }
  }

  async analyzeSymptoms(req: Request, res: Response, next: NextFunction) {
    try {
      const { description } = req.body;
      const analysis = await aiService.analyzeSymptoms(description);
      
      logger.info('Symptoms analyzed successfully');
      res.json({ analysis });
    } catch (error) {
      next(error);
    }
  }

  async generateMedicalReport(req: Request, res: Response, next: NextFunction) {
    try {
      const consultationId = req.params.consultationId;
      const consultation = await consultationService.getConsultation(consultationId);
      const report = await aiService.generateMedicalReport(consultation);
      
      logger.info('Medical report generated successfully');
      res.json({ report });
    } catch (error) {
      next(error);
    }
  }

  async suggestPrescription(req: Request, res: Response, next: NextFunction) {
    try {
      const { symptoms, diagnosis } = req.body;
      const prescription = await aiService.suggestPrescription(symptoms, diagnosis);
      
      logger.info('Prescription suggestion generated successfully');
      res.json({ prescription });
    } catch (error) {
      next(error);
    }
  }
} 