import 'dotenv/config';
import { RabbitMQClient } from './lib/RabbitMQClient';
import { exchanges, queues, bindings } from './config/queues';
import { logger } from './utils/logger';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672';

async function setupMessageBroker(): Promise<void> {
  const client = new RabbitMQClient(RABBITMQ_URL);

  try {
    // Conectar ao RabbitMQ
    await client.connect();

    // Configurar exchanges
    for (const exchange of exchanges) {
      await client.assertExchange(exchange);
    }

    // Configurar filas
    for (const queue of queues) {
      await client.assertQueue(queue);
    }

    // Configurar bindings
    for (const binding of bindings) {
      await client.bindQueue(binding);
    }

    logger.info('Message broker setup completed successfully');

    // Configurar graceful shutdown
    process.on('SIGTERM', async () => {
      logger.info('SIGTERM signal received. Starting graceful shutdown...');
      await gracefulShutdown(client);
    });

    process.on('SIGINT', async () => {
      logger.info('SIGINT signal received. Starting graceful shutdown...');
      await gracefulShutdown(client);
    });

  } catch (error) {
    logger.error('Failed to setup message broker:', error);
    process.exit(1);
  }
}

async function gracefulShutdown(client: RabbitMQClient): Promise<void> {
  try {
    await client.close();
    logger.info('Message broker connections closed');
    process.exit(0);
  } catch (error) {
    logger.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
}

// Iniciar o serviço
setupMessageBroker().catch((error) => {
  logger.error('Unhandled error during startup:', error);
  process.exit(1);
}); 