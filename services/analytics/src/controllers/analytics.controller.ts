import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middlewares/errorHandler';
import { logger } from '@sanara/logger';

const prisma = new PrismaClient();

export class AnalyticsController {
  async getClinicMetrics(req: Request, res: Response, next: NextFunction) {
    try {
      const { clinicId } = req.params;
      const { startDate, endDate } = req.query;

      const metrics = await prisma.clinicMetrics.findMany({
        where: {
          clinicId,
          date: {
            gte: startDate ? new Date(startDate as string) : undefined,
            lte: endDate ? new Date(endDate as string) : undefined,
          },
        },
        orderBy: {
          date: 'asc',
        },
      });

      res.json(metrics);
    } catch (error) {
      next(error);
    }
  }

  async getDoctorMetrics(req: Request, res: Response, next: NextFunction) {
    try {
      const { doctorId } = req.params;
      const { startDate, endDate } = req.query;

      const metrics = await prisma.doctorMetrics.findMany({
        where: {
          doctorId,
          date: {
            gte: startDate ? new Date(startDate as string) : undefined,
            lte: endDate ? new Date(endDate as string) : undefined,
          },
        },
        orderBy: {
          date: 'asc',
        },
      });

      res.json(metrics);
    } catch (error) {
      next(error);
    }
  }

  async addPatientFeedback(req: Request, res: Response, next: NextFunction) {
    try {
      const { appointmentId, patientId, doctorId, clinicId, rating, comment, category } = req.body;

      const existingFeedback = await prisma.patientFeedback.findUnique({
        where: { appointmentId },
      });

      if (existingFeedback) {
        throw new AppError(400, 'Feedback already exists for this appointment');
      }

      const feedback = await prisma.patientFeedback.create({
        data: {
          appointmentId,
          patientId,
          doctorId,
          clinicId,
          rating,
          comment,
          category,
        },
      });

      logger.info('Patient feedback added', { feedbackId: feedback.id });

      // Update doctor metrics
      await this.updateDoctorMetrics(doctorId, clinicId);

      // Update clinic metrics
      await this.updateClinicMetrics(clinicId);

      res.status(201).json(feedback);
    } catch (error) {
      next(error);
    }
  }

  private async updateDoctorMetrics(doctorId: string, clinicId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const appointments = await prisma.appointment.count({
      where: {
        doctorId,
        date: {
          gte: today,
        },
      },
    });

    const completedAppointments = await prisma.appointment.count({
      where: {
        doctorId,
        status: 'COMPLETED',
        date: {
          gte: today,
        },
      },
    });

    const feedback = await prisma.patientFeedback.aggregate({
      where: {
        doctorId,
        createdAt: {
          gte: today,
        },
      },
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    });

    await prisma.doctorMetrics.upsert({
      where: {
        doctorId_date: {
          doctorId,
          date: today,
        },
      },
      create: {
        doctorId,
        clinicId,
        date: today,
        totalAppointments: appointments,
        completedAppointments,
        averageRating: feedback._avg.rating || 0,
        patientFeedback: feedback._count.rating,
      },
      update: {
        totalAppointments: appointments,
        completedAppointments,
        averageRating: feedback._avg.rating || 0,
        patientFeedback: feedback._count.rating,
      },
    });
  }

  private async updateClinicMetrics(clinicId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const appointments = await prisma.appointment.count({
      where: {
        clinicId,
        date: {
          gte: today,
        },
      },
    });

    const completedAppointments = await prisma.appointment.count({
      where: {
        clinicId,
        status: 'COMPLETED',
        date: {
          gte: today,
        },
      },
    });

    const newPatients = await prisma.patient.count({
      where: {
        clinicId,
        createdAt: {
          gte: today,
        },
      },
    });

    const feedback = await prisma.patientFeedback.aggregate({
      where: {
        clinicId,
        createdAt: {
          gte: today,
        },
      },
      _avg: {
        rating: true,
      },
    });

    await prisma.clinicMetrics.upsert({
      where: {
        clinicId_date: {
          clinicId,
          date: today,
        },
      },
      create: {
        clinicId,
        date: today,
        totalAppointments: appointments,
        completedAppointments,
        newPatients,
        satisfaction: feedback._avg.rating || 0,
      },
      update: {
        totalAppointments: appointments,
        completedAppointments,
        newPatients,
        satisfaction: feedback._avg.rating || 0,
      },
    });
  }
} 