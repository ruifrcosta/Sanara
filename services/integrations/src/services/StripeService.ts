import Stripe from 'stripe';
import { StripeConfig, StripePayment, StripeCustomer, StripeRefund, StripeProduct, StripeSubscription } from '../types/stripe';
import { logger } from '../utils/logger';

export class StripeService {
  private client: Stripe;
  private config: StripeConfig;

  constructor(config: StripeConfig) {
    this.config = config;
    this.client = new Stripe(config.secretKey, {
      apiVersion: '2023-10-16',
    });
  }

  // Gerenciamento de Clientes
  async createCustomer(data: Partial<StripeCustomer>): Promise<StripeCustomer> {
    try {
      const customer = await this.client.customers.create({
        email: data.email,
        name: data.name,
        phone: data.phone,
        metadata: data.metadata,
      });

      return {
        id: customer.id,
        email: customer.email || '',
        name: customer.name || undefined,
        phone: customer.phone || undefined,
        metadata: customer.metadata,
        defaultPaymentMethod: customer.default_source?.toString(),
        createdAt: new Date(customer.created * 1000),
      };
    } catch (error) {
      logger.error('Error creating customer:', error);
      throw error;
    }
  }

  async getCustomer(customerId: string): Promise<StripeCustomer> {
    try {
      const customer = await this.client.customers.retrieve(customerId);
      if (customer.deleted) {
        throw new Error('Customer not found');
      }

      return {
        id: customer.id,
        email: customer.email || '',
        name: customer.name || undefined,
        phone: customer.phone || undefined,
        metadata: customer.metadata,
        defaultPaymentMethod: customer.default_source?.toString(),
        createdAt: new Date(customer.created * 1000),
      };
    } catch (error) {
      logger.error('Error getting customer:', error);
      throw error;
    }
  }

  // Gerenciamento de Pagamentos
  async createPayment(data: Partial<StripePayment>): Promise<StripePayment> {
    try {
      const paymentIntent = await this.client.paymentIntents.create({
        amount: data.amount!,
        currency: data.currency || this.config.currency,
        customer: data.customerId,
        payment_method: data.paymentMethod,
        metadata: data.metadata,
        confirm: true,
      });

      return {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        paymentMethod: paymentIntent.payment_method as string,
        customerId: paymentIntent.customer as string,
        metadata: paymentIntent.metadata,
        createdAt: new Date(paymentIntent.created * 1000),
      };
    } catch (error) {
      logger.error('Error creating payment:', error);
      throw error;
    }
  }

  async getPayment(paymentId: string): Promise<StripePayment> {
    try {
      const paymentIntent = await this.client.paymentIntents.retrieve(paymentId);

      return {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        paymentMethod: paymentIntent.payment_method as string,
        customerId: paymentIntent.customer as string,
        metadata: paymentIntent.metadata,
        createdAt: new Date(paymentIntent.created * 1000),
      };
    } catch (error) {
      logger.error('Error getting payment:', error);
      throw error;
    }
  }

  // Gerenciamento de Reembolsos
  async createRefund(data: Partial<StripeRefund>): Promise<StripeRefund> {
    try {
      const refund = await this.client.refunds.create({
        payment_intent: data.paymentIntentId,
        amount: data.amount,
        reason: data.reason as Stripe.RefundCreateParams.Reason,
        metadata: data.metadata,
      });

      return {
        id: refund.id,
        amount: refund.amount,
        currency: refund.currency,
        status: refund.status,
        paymentIntentId: refund.payment_intent as string,
        reason: refund.reason || undefined,
        metadata: refund.metadata,
        createdAt: new Date(refund.created * 1000),
      };
    } catch (error) {
      logger.error('Error creating refund:', error);
      throw error;
    }
  }

  // Gerenciamento de Produtos
  async createProduct(data: Partial<StripeProduct>): Promise<StripeProduct> {
    try {
      const product = await this.client.products.create({
        name: data.name!,
        description: data.description,
        active: data.active,
        metadata: data.metadata,
      });

      return {
        id: product.id,
        name: product.name,
        description: product.description || undefined,
        active: product.active,
        metadata: product.metadata,
        prices: [],
        createdAt: new Date(product.created * 1000),
      };
    } catch (error) {
      logger.error('Error creating product:', error);
      throw error;
    }
  }

  // Gerenciamento de Assinaturas
  async createSubscription(customerId: string, priceId: string): Promise<StripeSubscription> {
    try {
      const subscription = await this.client.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
      });

      return {
        id: subscription.id,
        customerId: subscription.customer as string,
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        metadata: subscription.metadata,
        createdAt: new Date(subscription.created * 1000),
      };
    } catch (error) {
      logger.error('Error creating subscription:', error);
      throw error;
    }
  }

  // Webhooks
  async constructEvent(payload: string | Buffer, signature: string): Promise<Stripe.Event> {
    try {
      return this.client.webhooks.constructEvent(
        payload,
        signature,
        this.config.webhookSecret
      );
    } catch (error) {
      logger.error('Error constructing webhook event:', error);
      throw error;
    }
  }
} 