import 'dotenv/config';
import { connectMongoDB } from './config/mongo';
import { connectPostgres, closePostgres } from './config/postgres';
import { logger } from './utils/logger';

async function startDatabases(): Promise<void> {
  try {
    // Conectar ao MongoDB
    await connectMongoDB();
    logger.info('MongoDB connection established');

    // Conectar ao PostgreSQL
    await connectPostgres();
    logger.info('PostgreSQL connection established');

    // Configurar handlers para graceful shutdown
    process.on('SIGTERM', async () => {
      logger.info('SIGTERM signal received. Starting graceful shutdown...');
      await gracefulShutdown();
    });

    process.on('SIGINT', async () => {
      logger.info('SIGINT signal received. Starting graceful shutdown...');
      await gracefulShutdown();
    });

    logger.info('Database service started successfully');
  } catch (error) {
    logger.error('Failed to start database service:', error);
    process.exit(1);
  }
}

async function gracefulShutdown(): Promise<void> {
  try {
    // Fechar conexão com PostgreSQL
    await closePostgres();
    logger.info('All database connections closed');
    process.exit(0);
  } catch (error) {
    logger.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
}

// Iniciar o serviço
startDatabases().catch((error) => {
  logger.error('Unhandled error during startup:', error);
  process.exit(1);
}); 