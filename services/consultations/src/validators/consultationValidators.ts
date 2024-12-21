import { z } from 'zod';

export const startConsultationSchema = z.object({
  appointmentId: z.string().uuid('Invalid appointment ID'),
  userId: z.string().uuid('Invalid user ID'),
  professionalId: z.string().uuid('Invalid professional ID'),
  type: z.enum(['VIDEO_CALL', 'CHAT'], {
    errorMap: () => ({ message: 'Type must be either VIDEO_CALL or CHAT' })
  }),
});

export const updateConsultationSchema = z.object({
  status: z.enum(['WAITING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'], {
    errorMap: () => ({ message: 'Invalid status value' })
  }).optional(),
  notes: z.string().optional(),
});

export const analyzeSymptomSchema = z.object({
  description: z.string().min(10, 'Description must be at least 10 characters long'),
});

export const suggestPrescriptionSchema = z.object({
  symptoms: z.string().min(10, 'Symptoms must be at least 10 characters long'),
  diagnosis: z.string().min(10, 'Diagnosis must be at least 10 characters long'),
}); 