import { z } from 'zod';

const familyMemberSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  role: z.string().min(1, 'Role is required'),
});

export const createFamilySchema = z.object({
  name: z.string().min(2, 'Family name must be at least 2 characters long'),
  members: z.array(familyMemberSchema).min(1, 'At least one member is required'),
});

export const updateFamilySchema = z.object({
  name: z.string().min(2, 'Family name must be at least 2 characters long'),
});

export const addFamilyMemberSchema = familyMemberSchema; 