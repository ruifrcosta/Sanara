import { Router } from 'express';
import { PaymentController } from '../controllers/paymentController';
import { validateRequest } from '../middlewares/validateRequest';
import {
  createPaymentSchema,
  createPaymentMethodSchema,
  processRefundSchema
} from '../validators/paymentValidators';

const router = Router();
const paymentController = new PaymentController();

// Create payment
router.post(
  '/',
  validateRequest(createPaymentSchema),
  paymentController.createPayment.bind(paymentController)
);

// Create payment method
router.post(
  '/methods',
  validateRequest(createPaymentMethodSchema),
  paymentController.createPaymentMethod.bind(paymentController)
);

// Process refund
router.post(
  '/:paymentId/refund',
  validateRequest(processRefundSchema),
  paymentController.processRefund.bind(paymentController)
);

// Handle Stripe webhooks
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  paymentController.handleStripeWebhook.bind(paymentController)
);

export const paymentRoutes = router; 