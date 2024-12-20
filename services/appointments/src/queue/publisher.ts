import { getChannel } from './setup';
import { config } from '../config';
import { logger } from '../utils/logger';

export interface NotificationMessage {
  appointmentId: string;
  userId: string;
  type: 'REMINDER' | 'CONFIRMATION' | 'CANCELLATION';
  scheduledFor: Date;
}

export async function publishNotification(notification: NotificationMessage) {
  try {
    const channel = getChannel();
    const message = Buffer.from(JSON.stringify(notification));

    channel.publish(
      config.rabbitmq.exchanges.appointments,
      'appointment.notification',
      message,
      {
        persistent: true,
        timestamp: Date.now(),
        contentType: 'application/json',
      }
    );

    logger.info('Notification published successfully', {
      appointmentId: notification.appointmentId,
      type: notification.type,
    });
  } catch (error) {
    logger.error('Failed to publish notification:', error);
    throw error;
  }
} 