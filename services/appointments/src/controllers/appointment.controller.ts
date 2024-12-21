import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middlewares/errorHandler';
import { logger } from '@sanara/logger';

const prisma = new PrismaClient();

export class AppointmentController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { patientId, doctorId, clinicId, date, type, notes, symptoms } = req.body;

      // Validate date is in the future
      if (new Date(date) < new Date()) {
        throw new AppError(400, 'Appointment date must be in the future');
      }

      // Check for conflicting appointments
      const conflicting = await prisma.appointment.findFirst({
        where: {
          doctorId,
          date: {
            gte: new Date(date),
            lt: new Date(new Date(date).getTime() + 30 * 60000), // 30 minutes
          },
          status: {
            in: ['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS'],
          },
        },
      });

      if (conflicting) {
        throw new AppError(409, 'Doctor has a conflicting appointment');
      }

      const appointment = await prisma.appointment.create({
        data: {
          patientId,
          doctorId,
          clinicId,
          date: new Date(date),
          type,
          notes,
          symptoms,
        },
      });

      logger.info('Appointment created', { appointmentId: appointment.id });

      res.status(201).json(appointment);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status, notes, diagnosis, treatment } = req.body;

      const appointment = await prisma.appointment.update({
        where: { id },
        data: {
          status,
          notes,
          diagnosis,
          treatment,
          updatedAt: new Date(),
        },
      });

      logger.info('Appointment updated', { appointmentId: id });

      res.json(appointment);
    } catch (error) {
      next(error);
    }
  }

  async cancel(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const appointment = await prisma.appointment.update({
        where: { id },
        data: {
          status: 'CANCELLED',
          notes: reason,
          cancelledAt: new Date(),
        },
      });

      logger.info('Appointment cancelled', { appointmentId: id });

      res.json(appointment);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const appointment = await prisma.appointment.findUnique({
        where: { id },
      });

      if (!appointment) {
        throw new AppError(404, 'Appointment not found');
      }

      res.json(appointment);
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { clinicId, doctorId, patientId, status, startDate, endDate } = req.query;

      const appointments = await prisma.appointment.findMany({
        where: {
          clinicId: clinicId as string,
          doctorId: doctorId as string,
          patientId: patientId as string,
          status: status as any,
          date: {
            gte: startDate ? new Date(startDate as string) : undefined,
            lte: endDate ? new Date(endDate as string) : undefined,
          },
        },
        orderBy: {
          date: 'asc',
        },
      });

      res.json(appointments);
    } catch (error) {
      next(error);
    }
  }

  async getDoctorSchedule(req: Request, res: Response, next: NextFunction) {
    try {
      const { doctorId } = req.params;
      const { date } = req.query;

      const startDate = date ? new Date(date as string) : new Date();
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);

      const appointments = await prisma.appointment.findMany({
        where: {
          doctorId,
          date: {
            gte: startDate,
            lt: endDate,
          },
        },
        orderBy: {
          date: 'asc',
        },
      });

      res.json(appointments);
    } catch (error) {
      next(error);
    }
  }
} 