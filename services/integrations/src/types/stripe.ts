import Stripe from 'stripe';

export interface StripeConfig {
  secretKey: string;
  publicKey: string;
  webhookSecret: string;
  currency: string;
  paymentMethods: string[];
}

export interface StripePayment {
  id: string;
  amount: number;
  currency: string;
  status: Stripe.PaymentIntent.Status;
  paymentMethod: string;
  customerId?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface StripeCustomer {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  metadata?: Record<string, any>;
  defaultPaymentMethod?: string;
  createdAt: Date;
}

export interface StripeRefund {
  id: string;
  amount: number;
  currency: string;
  status: Stripe.Refund.Status;
  paymentIntentId: string;
  reason?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface StripeProduct {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  metadata?: Record<string, any>;
  prices: Stripe.Price[];
  createdAt: Date;
}

export interface StripeSubscription {
  id: string;
  customerId: string;
  status: Stripe.Subscription.Status;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface StripeClients {
  client: Stripe;
} 