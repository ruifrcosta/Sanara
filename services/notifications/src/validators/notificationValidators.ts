import { z } from 'zod';

export const createNotificationSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  type: z.enum(['EMAIL', 'SMS', 'PUSH'], {
    errorMap: () => ({ message: 'Type must be either EMAIL, SMS, or PUSH' })
  }),
  template: z.string().min(1, 'Template identifier is required'),
  data: z.record(z.any()).optional(),
  scheduledFor: z.string().datetime().optional(),
}); 