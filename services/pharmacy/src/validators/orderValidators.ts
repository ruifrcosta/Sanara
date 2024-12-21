import { z } from 'zod';
import { PharmacyOrderStatus } from '@prisma/client';

export const createPharmacyOrderSchema = z.object({
  orderId: z.string().uuid('Invalid order ID'),
  items: z.array(z.object({
    productId: z.string().uuid('Invalid product ID'),
    quantity: z.number().int('Quantity must be an integer').positive('Quantity must be positive'),
    price: z.number().positive('Price must be positive')
  })).min(1, 'At least one item is required')
});

export const updatePharmacyOrderSchema = z.object({
  status: z.nativeEnum(PharmacyOrderStatus, {
    errorMap: () => ({ message: 'Invalid order status' })
  })
});

export const orderParamsSchema = z.object({
  pharmacyId: z.string().uuid('Invalid pharmacy ID'),
  orderId: z.string().uuid('Invalid order ID')
});

export const listOrdersQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  status: z.nativeEnum(PharmacyOrderStatus, {
    errorMap: () => ({ message: 'Invalid order status' })
  }).optional(),
  startDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)')
    .transform(val => new Date(val))
    .optional(),
  endDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)')
    .transform(val => new Date(val))
    .optional()
}).refine(
  data => {
    if (data.startDate && data.endDate) {
      return data.startDate <= data.endDate;
    }
    return true;
  },
  {
    message: 'Start date must be before or equal to end date'
  }
); 