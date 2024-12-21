import { z } from 'zod';
import { PharmacyStatus } from '@prisma/client';

const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  number: z.string().min(1, 'Number is required'),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, 'Neighborhood is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  zipCode: z.string().min(1, 'ZIP code is required')
});

const operatingHoursSchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  openTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:mm)'),
  closeTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:mm)'),
  isOpen: z.boolean()
});

export const createPharmacySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  cnpj: z.string().regex(/^\d{14}$/, 'CNPJ must have 14 digits'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(10, 'Phone must have at least 10 digits'),
  address: addressSchema,
  operatingHours: z.array(operatingHoursSchema)
    .min(7, 'Operating hours must be defined for all days of the week')
    .max(7, 'Operating hours cannot exceed 7 days')
});

export const updatePharmacySchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  email: z.string().email('Invalid email format').optional(),
  phone: z.string().min(10, 'Phone must have at least 10 digits').optional(),
  status: z.nativeEnum(PharmacyStatus, {
    errorMap: () => ({ message: 'Invalid pharmacy status' })
  }).optional(),
  address: addressSchema.optional(),
  operatingHours: z.array(operatingHoursSchema)
    .min(7, 'Operating hours must be defined for all days of the week')
    .max(7, 'Operating hours cannot exceed 7 days')
    .optional()
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be provided'
});

export const pharmacyParamsSchema = z.object({
  pharmacyId: z.string().uuid('Invalid pharmacy ID')
});

export const listPharmaciesQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  status: z.nativeEnum(PharmacyStatus, {
    errorMap: () => ({ message: 'Invalid pharmacy status' })
  }).optional(),
  city: z.string().optional(),
  state: z.string().optional()
});

export const searchNearbyPharmaciesQuerySchema = z.object({
  latitude: z.string().transform(val => {
    const num = parseFloat(val);
    if (isNaN(num) || num < -90 || num > 90) {
      throw new Error('Invalid latitude');
    }
    return num;
  }),
  longitude: z.string().transform(val => {
    const num = parseFloat(val);
    if (isNaN(num) || num < -180 || num > 180) {
      throw new Error('Invalid longitude');
    }
    return num;
  }),
  radius: z.string().transform(val => {
    const num = parseFloat(val);
    if (isNaN(num) || num <= 0) {
      throw new Error('Invalid radius');
    }
    return num;
  }).optional(),
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional()
}); 