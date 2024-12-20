import { z } from 'zod';

export const createAppointmentSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  professionalId: z.string().uuid('Invalid professional ID'),
  startTime: z.string().datetime('Invalid date format'),
  type: z.enum(['VIDEO_CALL', 'CHAT'], {
    errorMap: () => ({ message: 'Type must be either VIDEO_CALL or CHAT' })
  }),
  notes: z.string().optional(),
});

export const updateAppointmentSchema = z.object({
  startTime: z.string().datetime('Invalid date format').optional(),
  status: z.enum(['SCHEDULED', 'CONFIRMED', 'CANCELLED', 'COMPLETED'], {
    errorMap: () => ({ message: 'Invalid status value' })
  }).optional(),
  notes: z.string().optional(),
}); 