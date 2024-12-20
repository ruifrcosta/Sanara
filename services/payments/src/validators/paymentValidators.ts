import { z } from 'zod';
import { PaymentMethodType } from '@prisma/client';

export const createPaymentSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  orderId: z.string().uuid('Invalid order ID'),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().length(3, 'Currency must be a 3-letter code').optional(),
  paymentMethodId: z.string().uuid('Invalid payment method ID')
});

export const createPaymentMethodSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  type: z.nativeEnum(PaymentMethodType, {
    errorMap: () => ({ message: 'Invalid payment method type' })
  }),
  token: z.string().optional(),
  isDefault: z.boolean().optional()
});

export const processRefundSchema = z.object({
  amount: z.number().positive('Amount must be positive').optional(),
  reason: z.string().min(1, 'Reason is required').max(500, 'Reason is too long').optional()
}); 