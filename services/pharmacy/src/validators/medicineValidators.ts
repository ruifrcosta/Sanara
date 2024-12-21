import { z } from 'zod';

export const createMedicineSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  activeIngredient: z.string().min(1, 'Active ingredient is required'),
  manufacturer: z.string().min(1, 'Manufacturer is required'),
  register: z.string().min(1, 'Register number is required'),
  controlled: z.boolean(),
  description: z.string().optional()
});

export const updateMedicineSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  activeIngredient: z.string().min(1, 'Active ingredient is required').optional(),
  manufacturer: z.string().min(1, 'Manufacturer is required').optional(),
  description: z.string().optional()
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be provided'
});

export const medicineParamsSchema = z.object({
  medicineId: z.string().uuid('Invalid medicine ID')
});

export const pharmacyMedicineParamsSchema = z.object({
  pharmacyId: z.string().uuid('Invalid pharmacy ID'),
  medicineId: z.string().uuid('Invalid medicine ID')
});

export const addMedicineToPharmacySchema = z.object({
  price: z.number().positive('Price must be positive'),
  stock: z.number().int().nonnegative('Stock must be non-negative')
});

export const updatePharmacyMedicineSchema = z.object({
  price: z.number().positive('Price must be positive').optional(),
  stock: z.number().int().nonnegative('Stock must be non-negative').optional()
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be provided'
});

export const listMedicinesQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional()
});

export const searchMedicinesQuerySchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional()
}); 