import { PrismaClient, Payment, PaymentStatus, PaymentMethod, PaymentMethodType } from '@prisma/client';
import Stripe from 'stripe';
import { config } from '../config';
import { logger } from '../utils/logger';
import { AppError } from '../middlewares/errorHandler';

const prisma = new PrismaClient();
const stripe = new Stripe(config.stripe.secretKey, {
  apiVersion: config.stripe.apiVersion
});

export interface CreatePaymentData {
  userId: string;
  orderId: string;
  amount: number;
  currency?: string;
  paymentMethodId: string;
}

export interface CreatePaymentMethodData {
  userId: string;
  type: PaymentMethodType;
  token?: string;
  isDefault?: boolean;
}

export class PaymentService {
  async createPayment(data: CreatePaymentData): Promise<Payment> {
    try {
      // Get user's payment method
      const paymentMethod = await prisma.paymentMethod.findFirst({
        where: { id: data.paymentMethodId, userId: data.userId }
      });

      if (!paymentMethod) {
        throw new AppError(404, 'Payment method not found');
      }

      // Get or create Stripe customer
      const stripeCustomerId = await this.getOrCreateStripeCustomer(data.userId);

      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(data.amount * 100), // Convert to cents
        currency: data.currency || 'brl',
        customer: stripeCustomerId,
        payment_method: paymentMethod.stripePaymentMethodId!,
        confirm: true,
        off_session: true
      });

      // Create payment record
      const payment = await prisma.payment.create({
        data: {
          userId: data.userId,
          orderId: data.orderId,
          amount: data.amount,
          currency: data.currency || 'BRL',
          status: PaymentStatus.PROCESSING,
          paymentMethod: paymentMethod.type,
          paymentIntentId: paymentIntent.id,
          stripeCustomerId
        }
      });

      logger.info('Payment created successfully', { paymentId: payment.id });
      return payment;
    } catch (error) {
      logger.error('Failed to create payment:', error);
      throw error;
    }
  }

  async createPaymentMethod(data: CreatePaymentMethodData): Promise<PaymentMethod> {
    try {
      // Create Stripe payment method if token is provided
      let stripePaymentMethodId: string | undefined;
      if (data.token) {
        const stripePaymentMethod = await stripe.paymentMethods.create({
          type: this.mapPaymentMethodType(data.type),
          card: { token: data.token }
        });
        stripePaymentMethodId = stripePaymentMethod.id;
      }

      // If setting as default, unset other default methods
      if (data.isDefault) {
        await prisma.paymentMethod.updateMany({
          where: { userId: data.userId },
          data: { isDefault: false }
        });
      }

      // Create payment method record
      const paymentMethod = await prisma.paymentMethod.create({
        data: {
          userId: data.userId,
          type: data.type,
          isDefault: data.isDefault || false,
          stripePaymentMethodId
        }
      });

      logger.info('Payment method created successfully', { paymentMethodId: paymentMethod.id });
      return paymentMethod;
    } catch (error) {
      logger.error('Failed to create payment method:', error);
      throw error;
    }
  }

  async processRefund(paymentId: string, amount?: number, reason?: string): Promise<Payment> {
    try {
      const payment = await prisma.payment.findUnique({
        where: { id: paymentId }
      });

      if (!payment) {
        throw new AppError(404, 'Payment not found');
      }

      if (payment.status !== PaymentStatus.COMPLETED) {
        throw new AppError(400, 'Payment cannot be refunded');
      }

      // Process refund through Stripe
      const refund = await stripe.refunds.create({
        payment_intent: payment.paymentIntentId!,
        amount: amount ? Math.round(amount * 100) : undefined
      });

      // Update payment record
      const updatedPayment = await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: PaymentStatus.REFUNDED,
          refundId: refund.id,
          refundAmount: amount || payment.amount,
          refundReason: reason
        }
      });

      logger.info('Payment refunded successfully', { paymentId });
      return updatedPayment;
    } catch (error) {
      logger.error('Failed to process refund:', error);
      throw error;
    }
  }

  private async getOrCreateStripeCustomer(userId: string): Promise<string> {
    try {
      // Check if user already has a Stripe customer ID
      const payment = await prisma.payment.findFirst({
        where: { userId, stripeCustomerId: { not: null } },
        select: { stripeCustomerId: true }
      });

      if (payment?.stripeCustomerId) {
        return payment.stripeCustomerId;
      }

      // Create new Stripe customer
      const customer = await stripe.customers.create({
        metadata: { userId }
      });

      return customer.id;
    } catch (error) {
      logger.error('Failed to get or create Stripe customer:', error);
      throw error;
    }
  }

  private mapPaymentMethodType(type: PaymentMethodType): Stripe.PaymentMethodCreateParams.Type {
    switch (type) {
      case PaymentMethodType.CREDIT_CARD:
      case PaymentMethodType.DEBIT_CARD:
        return 'card';
      default:
        throw new AppError(400, 'Unsupported payment method type');
    }
  }
} 