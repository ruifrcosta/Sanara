import { z } from 'zod';

export const createBrandSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  description: z.string().max(1000, 'Description is too long').optional()
});

export const updateBrandSchema = createBrandSchema.partial().extend({
  deleteLogo: z.boolean().optional()
}); 