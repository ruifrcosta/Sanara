import { config } from 'dotenv';

config();

export const rabbitmqConfig = {
  url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
  credentials: {
    username: process.env.RABBITMQ_USER || 'guest',
    password: process.env.RABBITMQ_PASSWORD || 'guest',
  },
  vhost: process.env.RABBITMQ_VHOST || '/',
  heartbeat: 60,
  connection: {
    retryLimit: 10,
    retryDelay: 5000,
  },
  channels: {
    prefetch: 10,
  },
  queues: {
    messageTtl: 24 * 60 * 60 * 1000, // 24 horas
    deadLetterTtl: 7 * 24 * 60 * 60 * 1000, // 7 dias
  },
  monitoring: {
    enabled: true,
    interval: 60000, // 1 minuto
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    elkEnabled: process.env.ELK_ENABLED === 'true',
    elkConfig: {
      host: process.env.ELK_HOST,
      port: process.env.ELK_PORT,
      index: 'rabbitmq-logs',
    },
  },
}; 