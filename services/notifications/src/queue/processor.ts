import { getChannel } from './setup';
import { config } from '../config';
import { logger } from '../utils/logger';
import { NotificationService } from '../services/notificationService';

const notificationService = new NotificationService();

export function startNotificationProcessor() {
  const channel = getChannel();

  // Process notifications queue
  channel.consume(config.rabbitmq.queues.notifications, async (msg) => {
    if (!msg) return;

    try {
      const data = JSON.parse(msg.content.toString());
      await notificationService.createNotification(data);
      channel.ack(msg);
    } catch (error) {
      logger.error('Failed to process notification message:', error);
      channel.nack(msg, false, false);
    }
  });

  // Process appointment notifications
  channel.consume(config.rabbitmq.queues.appointments, async (msg) => {
    if (!msg) return;

    try {
      const data = JSON.parse(msg.content.toString());
      await processAppointmentNotification(data);
      channel.ack(msg);
    } catch (error) {
      logger.error('Failed to process appointment notification:', error);
      channel.nack(msg, false, false);
    }
  });

  // Process consultation notifications
  channel.consume(config.rabbitmq.queues.consultations, async (msg) => {
    if (!msg) return;

    try {
      const data = JSON.parse(msg.content.toString());
      await processConsultationNotification(data);
      channel.ack(msg);
    } catch (error) {
      logger.error('Failed to process consultation notification:', error);
      channel.nack(msg, false, false);
    }
  });

  // Start notification processor
  setInterval(processPendingNotifications, config.notifications.processInterval);
  logger.info('Notification processor started');
}

async function processPendingNotifications() {
  try {
    const notifications = await notificationService.getPendingNotifications();
    
    for (const notification of notifications) {
      try {
        await notificationService.sendNotification(notification);
      } catch (error) {
        logger.error('Failed to send notification:', error);
      }
    }
  } catch (error) {
    logger.error('Failed to process pending notifications:', error);
  }
}

async function processAppointmentNotification(data: any) {
  const { appointmentId, userId, type, scheduledFor } = data;

  let template: string;
  let notificationData: any = {
    appointmentId,
    scheduledFor: data.appointmentTime,
  };

  switch (type) {
    case 'REMINDER':
      template = 'appointment-reminder';
      break;
    case 'CONFIRMATION':
      template = 'appointment-confirmation';
      break;
    case 'CANCELLATION':
      template = 'appointment-cancellation';
      break;
    default:
      throw new Error('Invalid appointment notification type');
  }

  await notificationService.createNotification({
    userId,
    type: 'EMAIL',
    template,
    data: notificationData,
    scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined
  });
}

async function processConsultationNotification(data: any) {
  const { consultationId, userId, type } = data;

  let template: string;
  let notificationData: any = {
    consultationId,
  };

  switch (type) {
    case 'STARTED':
      template = 'consultation-started';
      break;
    case 'ENDED':
      template = 'consultation-ended';
      break;
    case 'REPORT_READY':
      template = 'consultation-report';
      notificationData.reportUrl = data.reportUrl;
      break;
    default:
      throw new Error('Invalid consultation notification type');
  }

  await notificationService.createNotification({
    userId,
    type: 'EMAIL',
    template,
    data: notificationData
  });
} 