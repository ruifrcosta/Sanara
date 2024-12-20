import { z } from 'zod';
import { InventoryStatus } from '@prisma/client';

export const addInventoryItemSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  quantity: z.number().int('Quantity must be an integer').min(0, 'Quantity cannot be negative'),
  price: z.number().positive('Price must be positive')
});

export const updateInventoryItemSchema = z.object({
  quantity: z.number().int('Quantity must be an integer').min(0, 'Quantity cannot be negative').optional(),
  price: z.number().positive('Price must be positive').optional(),
  status: z.nativeEnum(InventoryStatus, {
    errorMap: () => ({ message: 'Invalid inventory status' })
  }).optional()
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be provided'
});

export const bulkUpdateInventorySchema = z.object({
  items: z.array(z.object({
    productId: z.string().uuid('Invalid product ID'),
    quantity: z.number().int('Quantity must be an integer').min(0, 'Quantity cannot be negative'),
    price: z.number().positive('Price must be positive').optional()
  })).min(1, 'At least one item is required')
});

export const inventoryParamsSchema = z.object({
  pharmacyId: z.string().uuid('Invalid pharmacy ID'),
  productId: z.string().uuid('Invalid product ID')
});

export const listInventoryQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  status: z.nativeEnum(InventoryStatus, {
    errorMap: () => ({ message: 'Invalid inventory status' })
  }).optional(),
  minQuantity: z.string().regex(/^\d+$/).transform(Number).optional(),
  maxQuantity: z.string().regex(/^\d+$/).transform(Number).optional()
});

export const checkAvailabilitySchema = z.object({
  items: z.array(z.object({
    productId: z.string().uuid('Invalid product ID'),
    quantity: z.number().int('Quantity must be an integer').positive('Quantity must be positive')
  })).min(1, 'At least one item is required')
}); 