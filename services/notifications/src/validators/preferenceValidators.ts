import { z } from 'zod';

export const updatePreferencesSchema = z.object({
  email: z.boolean().optional(),
  sms: z.boolean().optional(),
  push: z.boolean().optional(),
  emailAddress: z.string().email('Invalid email address').optional(),
  phoneNumber: z.string().regex(/^\+[1-9]\d{1,14}$/, 'Invalid phone number format').optional(),
  fcmToken: z.string().optional(),
});

export const updateFCMTokenSchema = z.object({
  fcmToken: z.string().min(1, 'FCM token is required'),
});

export const verifyPhoneNumberSchema = z.object({
  phoneNumber: z.string().regex(/^\+[1-9]\d{1,14}$/, 'Invalid phone number format'),
}); 