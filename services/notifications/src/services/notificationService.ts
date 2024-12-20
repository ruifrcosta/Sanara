import { PrismaClient, Notification } from '@prisma/client';
import { AppError } from '../middlewares/errorHandler';
import { logger } from '../utils/logger';
import { EmailService } from './emailService';
import { SMSService } from './smsService';
import { PushService } from './pushService';
import { TemplateService } from './templateService';

const prisma = new PrismaClient();
const emailService = new EmailService();
const smsService = new SMSService();
const pushService = new PushService();
const templateService = new TemplateService();

export interface CreateNotificationData {
  userId: string;
  type: 'EMAIL' | 'SMS' | 'PUSH';
  template: string;
  data?: Record<string, any>;
  scheduledFor?: Date;
}

export class NotificationService {
  async createNotification(data: CreateNotificationData) {
    try {
      // Get user preferences
      const preferences = await prisma.notificationPreference.findUnique({
        where: { userId: data.userId }
      });

      if (!preferences) {
        throw new AppError(404, 'User notification preferences not found');
      }

      // Check if user accepts this type of notification
      if (!this.isNotificationTypeEnabled(preferences, data.type)) {
        logger.info('Notification type disabled by user preferences', {
          userId: data.userId,
          type: data.type
        });
        return null;
      }

      // Get and process template
      const template = await templateService.getTemplate(data.template);
      const { title, content } = templateService.processTemplate(template, data.data || {});

      // Create notification
      const notification = await prisma.notification.create({
        data: {
          userId: data.userId,
          type: data.type,
          template: data.template,
          title,
          content,
          data: data.data || {},
          status: 'PENDING',
          scheduledFor: data.scheduledFor
        }
      });

      logger.info('Notification created successfully', { notificationId: notification.id });
      return notification;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Failed to create notification:', error);
      throw new AppError(500, 'Failed to create notification');
    }
  }

  async sendNotification(notification: Notification) {
    try {
      // Get user preferences
      const preferences = await prisma.notificationPreference.findUnique({
        where: { userId: notification.userId }
      });

      if (!preferences) {
        throw new AppError(404, 'User notification preferences not found');
      }

      // Send notification based on type
      switch (notification.type) {
        case 'EMAIL':
          if (!preferences.emailAddress) {
            throw new AppError(400, 'User email address not found');
          }
          await emailService.sendEmail({
            to: preferences.emailAddress,
            subject: notification.title,
            content: notification.content
          });
          break;

        case 'SMS':
          if (!preferences.phoneNumber) {
            throw new AppError(400, 'User phone number not found');
          }
          await smsService.sendSMS({
            to: preferences.phoneNumber,
            content: notification.content
          });
          break;

        case 'PUSH':
          if (!preferences.fcmToken) {
            throw new AppError(400, 'User FCM token not found');
          }
          await pushService.sendPushNotification({
            token: preferences.fcmToken,
            title: notification.title,
            body: notification.content,
            data: notification.data as Record<string, string>
          });
          break;

        default:
          throw new AppError(400, 'Invalid notification type');
      }

      // Update notification status
      await prisma.notification.update({
        where: { id: notification.id },
        data: {
          status: 'SENT',
          sentAt: new Date()
        }
      });

      logger.info('Notification sent successfully', { notificationId: notification.id });
    } catch (error) {
      logger.error('Failed to send notification:', error);

      // Update notification status with error
      await prisma.notification.update({
        where: { id: notification.id },
        data: {
          status: 'FAILED',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });

      throw error;
    }
  }

  async getNotification(notificationId: string) {
    try {
      const notification = await prisma.notification.findUnique({
        where: { id: notificationId }
      });

      if (!notification) {
        throw new AppError(404, 'Notification not found');
      }

      return notification;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Failed to get notification:', error);
      throw new AppError(500, 'Failed to get notification');
    }
  }

  async listUserNotifications(userId: string) {
    try {
      const notifications = await prisma.notification.findMany({
        where: { userId },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return notifications;
    } catch (error) {
      logger.error('Failed to list user notifications:', error);
      throw new AppError(500, 'Failed to list notifications');
    }
  }

  async getPendingNotifications() {
    try {
      const now = new Date();
      return await prisma.notification.findMany({
        where: {
          status: 'PENDING',
          OR: [
            { scheduledFor: null },
            { scheduledFor: { lte: now } }
          ]
        },
        orderBy: {
          createdAt: 'asc'
        },
        take: 100
      });
    } catch (error) {
      logger.error('Failed to get pending notifications:', error);
      throw error;
    }
  }

  private isNotificationTypeEnabled(preferences: any, type: string): boolean {
    switch (type) {
      case 'EMAIL':
        return preferences.email;
      case 'SMS':
        return preferences.sms;
      case 'PUSH':
        return preferences.push;
      default:
        return false;
    }
  }
} 