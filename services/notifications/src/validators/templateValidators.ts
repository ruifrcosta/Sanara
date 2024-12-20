import { z } from 'zod';

export const createTemplateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  description: z.string().min(10, 'Description must be at least 10 characters long'),
  type: z.enum(['EMAIL', 'SMS', 'PUSH'], {
    errorMap: () => ({ message: 'Type must be either EMAIL, SMS, or PUSH' })
  }),
  subject: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
});

export const updateTemplateSchema = z.object({
  description: z.string().min(10, 'Description must be at least 10 characters long').optional(),
  subject: z.string().optional(),
  content: z.string().min(1, 'Content is required').optional(),
  active: z.boolean().optional(),
}); 