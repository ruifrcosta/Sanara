import { z } from 'zod';

const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  number: z.string().min(1, 'Number is required'),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, 'Neighborhood is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  zipCode: z.string().min(1, 'ZIP code is required'),
});

const healthProfileSchema = z.object({
  bloodType: z.string().optional(),
  allergies: z.array(z.string()).optional(),
  chronicConditions: z.array(z.string()).optional(),
  medications: z.array(z.string()).optional(),
});

export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  birthDate: z.string().datetime().optional(),
  gender: z.string().optional(),
  phoneNumber: z.string().optional(),
  address: addressSchema.optional(),
  healthProfile: healthProfileSchema.optional(),
});

export const updateUserSchema = createUserSchema.partial(); 