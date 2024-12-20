import { PrismaClient } from '@prisma/client';
import { AppError } from '../middlewares/errorHandler';
import { logger } from '../utils/logger';
import { SMSService } from './smsService';

const prisma = new PrismaClient();
const smsService = new SMSService();

export interface UpdatePreferencesData {
  email?: boolean;
  sms?: boolean;
  push?: boolean;
  emailAddress?: string;
  phoneNumber?: string;
  fcmToken?: string;
}

export class PreferenceService {
  async getPreferences(userId: string) {
    try {
      const preferences = await prisma.notificationPreference.findUnique({
        where: { userId }
      });

      if (!preferences) {
        // Create default preferences if they don't exist
        return await prisma.notificationPreference.create({
          data: {
            userId,
            email: true,
            sms: true,
            push: true
          }
        });
      }

      return preferences;
    } catch (error) {
      logger.error('Failed to get preferences:', error);
      throw new AppError(500, 'Failed to get preferences');
    }
  }

  async updatePreferences(userId: string, data: UpdatePreferencesData) {
    try {
      // Verify phone number if it's being updated
      if (data.phoneNumber) {
        const verification = await this.verifyPhoneNumber(data.phoneNumber);
        if (!verification.valid) {
          throw new AppError(400, 'Invalid phone number');
        }
      }

      const preferences = await prisma.notificationPreference.upsert({
        where: { userId },
        create: {
          userId,
          email: data.email ?? true,
          sms: data.sms ?? true,
          push: data.push ?? true,
          emailAddress: data.emailAddress,
          phoneNumber: data.phoneNumber,
          fcmToken: data.fcmToken
        },
        update: data
      });

      logger.info('Preferences updated successfully', { userId });
      return preferences;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Failed to update preferences:', error);
      throw new AppError(500, 'Failed to update preferences');
    }
  }

  async updateFCMToken(userId: string, fcmToken: string) {
    try {
      const preferences = await prisma.notificationPreference.upsert({
        where: { userId },
        create: {
          userId,
          fcmToken,
          email: true,
          sms: true,
          push: true
        },
        update: {
          fcmToken,
          push: true
        }
      });

      logger.info('FCM token updated successfully', { userId });
      return preferences;
    } catch (error) {
      logger.error('Failed to update FCM token:', error);
      throw new AppError(500, 'Failed to update FCM token');
    }
  }

  async verifyPhoneNumber(phoneNumber: string) {
    try {
      return await smsService.verifyPhoneNumber(phoneNumber);
    } catch (error) {
      logger.error('Failed to verify phone number:', error);
      throw new AppError(500, 'Failed to verify phone number');
    }
  }
} 