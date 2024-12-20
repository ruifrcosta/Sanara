import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middlewares/errorHandler';
import { logger } from '@sanara/logger';

const prisma = new PrismaClient();

export class PatientController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        userId,
        clinicId,
        name,
        dateOfBirth,
        gender,
        bloodType,
        phone,
        email,
        address,
        emergencyContact,
        allergies,
        medicalConditions,
        medications,
        notes,
      } = req.body;

      const existingPatient = await prisma.patient.findUnique({
        where: { userId },
      });

      if (existingPatient) {
        throw new AppError(400, 'Patient already exists for this user');
      }

      const patient = await prisma.patient.create({
        data: {
          userId,
          clinicId,
          name,
          dateOfBirth: new Date(dateOfBirth),
          gender,
          bloodType,
          phone,
          email,
          address,
          emergencyContact,
          allergies,
          medicalConditions,
          medications,
          notes,
        },
      });

      logger.info('Patient created', { patientId: patient.id });

      res.status(201).json(patient);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const {
        name,
        phone,
        email,
        address,
        emergencyContact,
        allergies,
        medicalConditions,
        medications,
        notes,
      } = req.body;

      const patient = await prisma.patient.update({
        where: { id },
        data: {
          name,
          phone,
          email,
          address,
          emergencyContact,
          allergies,
          medicalConditions,
          medications,
          notes,
          updatedAt: new Date(),
        },
      });

      logger.info('Patient updated', { patientId: id });

      res.json(patient);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const patient = await prisma.patient.findUnique({
        where: { id },
        include: {
          medicalRecords: {
            orderBy: {
              date: 'desc',
            },
          },
        },
      });

      if (!patient) {
        throw new AppError(404, 'Patient not found');
      }

      res.json(patient);
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { clinicId, search, status } = req.query;

      const patients = await prisma.patient.findMany({
        where: {
          clinicId: clinicId as string,
          status: status as any,
          OR: search
            ? [
                { name: { contains: search as string, mode: 'insensitive' } },
                { email: { contains: search as string, mode: 'insensitive' } },
              ]
            : undefined,
        },
        orderBy: {
          name: 'asc',
        },
      });

      res.json(patients);
    } catch (error) {
      next(error);
    }
  }

  async addMedicalRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const { patientId } = req.params;
      const { doctorId, type, description, diagnosis, treatment, prescription, attachments } =
        req.body;

      const medicalRecord = await prisma.medicalRecord.create({
        data: {
          patientId,
          doctorId,
          type,
          date: new Date(),
          description,
          diagnosis,
          treatment,
          prescription,
          attachments,
        },
      });

      logger.info('Medical record added', {
        patientId,
        medicalRecordId: medicalRecord.id,
      });

      res.status(201).json(medicalRecord);
    } catch (error) {
      next(error);
    }
  }

  async getMedicalRecords(req: Request, res: Response, next: NextFunction) {
    try {
      const { patientId } = req.params;
      const { type, startDate, endDate } = req.query;

      const medicalRecords = await prisma.medicalRecord.findMany({
        where: {
          patientId,
          type: type as any,
          date: {
            gte: startDate ? new Date(startDate as string) : undefined,
            lte: endDate ? new Date(endDate as string) : undefined,
          },
        },
        orderBy: {
          date: 'desc',
        },
      });

      res.json(medicalRecords);
    } catch (error) {
      next(error);
    }
  }
} 