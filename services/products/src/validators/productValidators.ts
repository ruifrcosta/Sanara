import { z } from 'zod';
import { ProductStatus, ProductType } from '@prisma/client';

export const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be positive'),
  comparePrice: z.number().positive('Compare price must be positive').optional(),
  sku: z.string().min(1, 'SKU is required').max(50, 'SKU is too long'),
  barcode: z.string().max(50, 'Barcode is too long').optional(),
  status: z.nativeEnum(ProductStatus).optional(),
  type: z.nativeEnum(ProductType),
  categoryId: z.string().uuid('Invalid category ID'),
  brandId: z.string().uuid('Invalid brand ID').optional(),
  attributes: z.array(z.object({
    name: z.string().min(1, 'Attribute name is required'),
    value: z.string().min(1, 'Attribute value is required')
  })).optional(),
  tags: z.array(z.string()).optional(),
  variants: z.array(z.object({
    name: z.string().min(1, 'Variant name is required'),
    sku: z.string().min(1, 'Variant SKU is required'),
    price: z.number().positive('Variant price must be positive'),
    comparePrice: z.number().positive('Variant compare price must be positive').optional(),
    inventory: z.number().min(0, 'Inventory cannot be negative'),
    options: z.record(z.string())
  })).optional(),
  inventory: z.object({
    quantity: z.number().min(0, 'Quantity cannot be negative'),
    lowStock: z.number().min(0, 'Low stock threshold cannot be negative').optional()
  }).optional()
});

export const updateProductSchema = createProductSchema.partial().extend({
  deleteImages: z.array(z.string().url('Invalid image URL')).optional()
});

export const productFilterSchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().uuid('Invalid category ID').optional(),
  brandId: z.string().uuid('Invalid brand ID').optional(),
  status: z.nativeEnum(ProductStatus).optional(),
  type: z.nativeEnum(ProductType).optional(),
  minPrice: z.number().positive('Minimum price must be positive').optional(),
  maxPrice: z.number().positive('Maximum price must be positive').optional(),
  inStock: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  page: z.string().regex(/^\d+$/).transform(Number).optional()
}); 