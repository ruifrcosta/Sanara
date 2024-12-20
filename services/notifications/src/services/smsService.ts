import twilio from 'twilio';
import { config } from '../config';
import { logger } from '../utils/logger';

export interface SendSMSData {
  to: string;
  content: string;
}

export class SMSService {
  private client: twilio.Twilio;

  constructor() {
    this.client = twilio(
      config.twilio.accountSid,
      config.twilio.authToken
    );
  }

  async sendSMS(data: SendSMSData) {
    try {
      const message = await this.client.messages.create({
        body: data.content,
        from: config.twilio.phoneNumber,
        to: data.to
      });

      logger.info('SMS sent successfully', {
        messageId: message.sid,
        to: data.to
      });

      return message;
    } catch (error) {
      logger.error('Failed to send SMS:', error);
      throw error;
    }
  }

  async verifyPhoneNumber(phoneNumber: string) {
    try {
      const lookup = await this.client.lookups.v2.phoneNumbers(phoneNumber).fetch();
      return {
        valid: true,
        phoneNumber: lookup.phoneNumber,
        countryCode: lookup.countryCode
      };
    } catch (error) {
      logger.error('Failed to verify phone number:', error);
      return {
        valid: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
} 