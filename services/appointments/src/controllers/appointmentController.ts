import { Request, Response, NextFunction } from 'express';
import { AppointmentService, CreateAppointmentData, UpdateAppointmentData } from '../services/appointmentService';
import { logger } from '../utils/logger';

const appointmentService = new AppointmentService();

export class AppointmentController {
  async createAppointment(req: Request, res: Response, next: NextFunction) {
    try {
      const appointmentData: CreateAppointmentData = {
        ...req.body,
        startTime: new Date(req.body.startTime)
      };
      const appointment = await appointmentService.createAppointment(appointmentData);
      
      logger.info('Appointment created successfully');
      res.status(201).json(appointment);
    } catch (error) {
      next(error);
    }
  }

  async updateAppointment(req: Request, res: Response, next: NextFunction) {
    try {
      const appointmentId = req.params.appointmentId;
      const appointmentData: UpdateAppointmentData = {
        ...req.body,
        startTime: req.body.startTime ? new Date(req.body.startTime) : undefined
      };
      const appointment = await appointmentService.updateAppointment(appointmentId, appointmentData);
      
      logger.info('Appointment updated successfully');
      res.json(appointment);
    } catch (error) {
      next(error);
    }
  }

  async getAppointment(req: Request, res: Response, next: NextFunction) {
    try {
      const appointmentId = req.params.appointmentId;
      const appointment = await appointmentService.getAppointment(appointmentId);
      
      logger.info('Appointment retrieved successfully');
      res.json(appointment);
    } catch (error) {
      next(error);
    }
  }

  async listUserAppointments(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      const status = req.query.status as string | undefined;
      const appointments = await appointmentService.listUserAppointments(userId, status);
      
      logger.info('User appointments listed successfully');
      res.json(appointments);
    } catch (error) {
      next(error);
    }
  }

  async listProfessionalAppointments(req: Request, res: Response, next: NextFunction) {
    try {
      const professionalId = req.params.professionalId;
      const status = req.query.status as string | undefined;
      const appointments = await appointmentService.listProfessionalAppointments(professionalId, status);
      
      logger.info('Professional appointments listed successfully');
      res.json(appointments);
    } catch (error) {
      next(error);
    }
  }
} 