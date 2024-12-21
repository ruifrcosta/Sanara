import amqp from 'amqplib';
import { config } from '../config';
import { logger } from '../utils/logger';

let channel: amqp.Channel;

export async function setupMessageQueue() {
  try {
    // Connect to RabbitMQ
    const connection = await amqp.connect(config.rabbitmq.url);
    channel = await connection.createChannel();

    // Setup exchange
    await channel.assertExchange(config.rabbitmq.exchanges.appointments, 'topic', {
      durable: true
    });

    // Setup queues
    await channel.assertQueue(config.rabbitmq.queues.notifications, {
      durable: true
    });

    // Bind queues to exchange
    await channel.bindQueue(
      config.rabbitmq.queues.notifications,
      config.rabbitmq.exchanges.appointments,
      'appointment.notification'
    );

    logger.info('Message queue setup completed');
  } catch (error) {
    logger.error('Failed to setup message queue:', error);
    throw error;
  }
}

export function getChannel(): amqp.Channel {
  if (!channel) {
    throw new Error('Message queue not initialized');
  }
  return channel;
} 