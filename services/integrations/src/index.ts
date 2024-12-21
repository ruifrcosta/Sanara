import 'dotenv/config';
import { Auth0Service } from './services/Auth0Service';
import { TwilioService } from './services/TwilioService';
import { StripeService } from './services/StripeService';
import { SendGridService } from './services/SendGridService';
import { logger } from './utils/logger';

// Auth0 Configuration
const auth0Config = {
  domain: process.env.AUTH0_DOMAIN!,
  clientId: process.env.AUTH0_CLIENT_ID!,
  clientSecret: process.env.AUTH0_CLIENT_SECRET!,
  audience: process.env.AUTH0_AUDIENCE!,
  scope: process.env.AUTH0_SCOPE!,
  connection: process.env.AUTH0_CONNECTION!,
};

// Twilio Configuration
const twilioConfig = {
  accountSid: process.env.TWILIO_ACCOUNT_SID!,
  authToken: process.env.TWILIO_AUTH_TOKEN!,
  apiKey: process.env.TWILIO_API_KEY!,
  apiSecret: process.env.TWILIO_API_SECRET!,
  roomType: process.env.TWILIO_ROOM_TYPE as 'group' | 'peer-to-peer',
};

// Stripe Configuration
const stripeConfig = {
  secretKey: process.env.STRIPE_SECRET_KEY!,
  publicKey: process.env.STRIPE_PUBLIC_KEY!,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  currency: process.env.STRIPE_CURRENCY!,
  paymentMethods: JSON.parse(process.env.STRIPE_PAYMENT_METHODS!),
};

// SendGrid Configuration
const sendGridConfig = {
  apiKey: process.env.SENDGRID_API_KEY!,
  fromEmail: process.env.SENDGRID_FROM_EMAIL!,
  fromName: process.env.SENDGRID_FROM_NAME!,
  templates: JSON.parse(process.env.SENDGRID_TEMPLATES!),
};

// Initialize Services
const auth0Service = new Auth0Service(auth0Config);
const twilioService = new TwilioService(twilioConfig);
const stripeService = new StripeService(stripeConfig);
const sendGridService = new SendGridService(sendGridConfig);

logger.info('Integration services initialized successfully');

export {
  auth0Service,
  twilioService,
  stripeService,
  sendGridService,
  Auth0Service,
  TwilioService,
  StripeService,
  SendGridService,
}; 