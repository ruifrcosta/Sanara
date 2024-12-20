import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  description: z.string().max(1000, 'Description is too long').optional(),
  parentId: z.string().uuid('Invalid parent category ID').optional()
});

export const updateCategorySchema = createCategorySchema.partial().extend({
  deleteImage: z.boolean().optional()
});

export const categoryParamsSchema = z.object({
  parentId: z.string().uuid('Invalid parent category ID').optional()
}); 