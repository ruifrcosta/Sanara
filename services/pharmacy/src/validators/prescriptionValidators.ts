import { z } from 'zod';
import { PrescriptionStatus } from '@prisma/client';

const prescriptionMedicineSchema = z.object({
  medicineId: z.string().uuid('Invalid medicine ID'),
  dosage: z.string().min(1, 'Dosage is required'),
  frequency: z.string().min(1, 'Frequency is required'),
  duration: z.string().min(1, 'Duration is required'),
  instructions: z.string().optional()
});

export const createPrescriptionSchema = z.object({
  pharmacyId: z.string().uuid('Invalid pharmacy ID'),
  userId: z.string().uuid('Invalid user ID'),
  doctorId: z.string().uuid('Invalid doctor ID'),
  expirationDate: z.string().datetime('Invalid expiration date'),
  medicines: z.array(prescriptionMedicineSchema).min(1, 'At least one medicine is required')
});

export const updatePrescriptionSchema = z.object({
  status: z.nativeEnum(PrescriptionStatus, {
    errorMap: () => ({ message: 'Invalid prescription status' })
  })
});

export const prescriptionParamsSchema = z.object({
  prescriptionId: z.string().uuid('Invalid prescription ID')
});

export const listPrescriptionsQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  status: z.nativeEnum(PrescriptionStatus, {
    errorMap: () => ({ message: 'Invalid prescription status' })
  }).optional()
});

export const userPrescriptionsParamsSchema = z.object({
  userId: z.string().uuid('Invalid user ID')
});

export const pharmacyPrescriptionsParamsSchema = z.object({
  pharmacyId: z.string().uuid('Invalid pharmacy ID')
}); 