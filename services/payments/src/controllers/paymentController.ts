import { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../services/paymentService';
import { logger } from '../utils/logger';

const paymentService = new PaymentService();

export class PaymentController {
  async createPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const payment = await paymentService.createPayment(req.body);
      logger.info('Payment created successfully');
      res.status(201).json(payment);
    } catch (error) {
      next(error);
    }
  }

  async createPaymentMethod(req: Request, res: Response, next: NextFunction) {
    try {
      const paymentMethod = await paymentService.createPaymentMethod(req.body);
      logger.info('Payment method created successfully');
      res.status(201).json(paymentMethod);
    } catch (error) {
      next(error);
    }
  }

  async processRefund(req: Request, res: Response, next: NextFunction) {
    try {
      const { paymentId } = req.params;
      const { amount, reason } = req.body;
      const payment = await paymentService.processRefund(paymentId, amount, reason);
      logger.info('Refund processed successfully');
      res.json(payment);
    } catch (error) {
      next(error);
    }
  }

  async handleStripeWebhook(req: Request, res: Response, next: NextFunction) {
    try {
      const sig = req.headers['stripe-signature'];
      
      // Verify webhook signature
      if (!sig) {
        throw new Error('No signature provided');
      }

      // Process webhook event
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        config.stripe.webhookSecret
      );

      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSuccess(event.data.object);
          break;
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailure(event.data.object);
          break;
        // Add more webhook handlers as needed
      }

      res.json({ received: true });
    } catch (error) {
      next(error);
    }
  }

  private async handlePaymentSuccess(paymentIntent: any) {
    try {
      await prisma.payment.updateMany({
        where: { paymentIntentId: paymentIntent.id },
        data: { status: PaymentStatus.COMPLETED }
      });

      logger.info('Payment marked as completed', { paymentIntentId: paymentIntent.id });
    } catch (error) {
      logger.error('Failed to handle payment success:', error);
      throw error;
    }
  }

  private async handlePaymentFailure(paymentIntent: any) {
    try {
      await prisma.payment.updateMany({
        where: { paymentIntentId: paymentIntent.id },
        data: { status: PaymentStatus.FAILED }
      });

      logger.info('Payment marked as failed', { paymentIntentId: paymentIntent.id });
    } catch (error) {
      logger.error('Failed to handle payment failure:', error);
      throw error;
    }
  }
} 