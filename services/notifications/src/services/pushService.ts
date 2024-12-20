import * as admin from 'firebase-admin';
import { config } from '../config';
import { logger } from '../utils/logger';

export interface SendPushNotificationData {
  token: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}

export class PushService {
  private app: admin.app.App;

  constructor() {
    this.app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: config.firebase.projectId,
        privateKey: config.firebase.privateKey,
        clientEmail: config.firebase.clientEmail
      })
    });
  }

  async sendPushNotification(data: SendPushNotificationData) {
    try {
      const message: admin.messaging.Message = {
        token: data.token,
        notification: {
          title: data.title,
          body: data.body
        },
        data: data.data,
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
            priority: 'high',
            channelId: 'default'
          }
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1
            }
          }
        }
      };

      const response = await this.app.messaging().send(message);
      logger.info('Push notification sent successfully', {
        messageId: response,
        token: data.token
      });

      return response;
    } catch (error) {
      logger.error('Failed to send push notification:', error);
      throw error;
    }
  }

  async sendMulticastPushNotification(tokens: string[], data: Omit<SendPushNotificationData, 'token'>) {
    try {
      const message: admin.messaging.MulticastMessage = {
        tokens,
        notification: {
          title: data.title,
          body: data.body
        },
        data: data.data,
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
            priority: 'high',
            channelId: 'default'
          }
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1
            }
          }
        }
      };

      const response = await this.app.messaging().sendMulticast(message);
      logger.info('Multicast push notification sent successfully', {
        successCount: response.successCount,
        failureCount: response.failureCount
      });

      return response;
    } catch (error) {
      logger.error('Failed to send multicast push notification:', error);
      throw error;
    }
  }

  async subscribeToTopic(token: string, topic: string) {
    try {
      await this.app.messaging().subscribeToTopic(token, topic);
      logger.info('Successfully subscribed to topic', { token, topic });
    } catch (error) {
      logger.error('Failed to subscribe to topic:', error);
      throw error;
    }
  }

  async unsubscribeFromTopic(token: string, topic: string) {
    try {
      await this.app.messaging().unsubscribeFromTopic(token, topic);
      logger.info('Successfully unsubscribed from topic', { token, topic });
    } catch (error) {
      logger.error('Failed to unsubscribe from topic:', error);
      throw error;
    }
  }

  async sendTopicMessage(topic: string, data: Omit<SendPushNotificationData, 'token'>) {
    try {
      const message: admin.messaging.Message = {
        topic,
        notification: {
          title: data.title,
          body: data.body
        },
        data: data.data,
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
            priority: 'high',
            channelId: 'default'
          }
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1
            }
          }
        }
      };

      const response = await this.app.messaging().send(message);
      logger.info('Topic message sent successfully', {
        messageId: response,
        topic
      });

      return response;
    } catch (error) {
      logger.error('Failed to send topic message:', error);
      throw error;
    }
  }
} 