import { z } from 'zod';

const availabilitySchema = z.object({
  dayOfWeek: z.number().min(0).max(6, 'Day of week must be between 0 (Sunday) and 6 (Saturday)'),
  startTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Start time must be in HH:mm format'),
  endTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'End time must be in HH:mm format'),
  slotDuration: z.number().min(15, 'Slot duration must be at least 15 minutes'),
});

export const createProfessionalSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Invalid email address'),
  speciality: z.string().min(2, 'Speciality must be at least 2 characters long'),
  crm: z.string().min(4, 'CRM must be at least 4 characters long'),
  availability: z.array(availabilitySchema).optional(),
});

export const updateProfessionalSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long').optional(),
  email: z.string().email('Invalid email address').optional(),
  speciality: z.string().min(2, 'Speciality must be at least 2 characters long').optional(),
  crm: z.string().min(4, 'CRM must be at least 4 characters long').optional(),
});

export const updateAvailabilitySchema = z.array(availabilitySchema); 