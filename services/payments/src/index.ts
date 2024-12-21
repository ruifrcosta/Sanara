import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { logger } from './utils/logger';
import { errorHandler } from './middlewares/errorHandler';
import { paymentRoutes } from './routes/payments';
import { setupMessageQueue } from './queue/setup';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/payments', paymentRoutes);

// Error handling
app.use(errorHandler);

async function start() {
  try {
    // Setup message queue
    await setupMessageQueue();

    // Start server
    app.listen(config.port, () => {
      logger.info(`Payment service listening on port ${config.port}`);
    });
  } catch (error) {
    logger.error('Failed to start payment service:', error);
    process.exit(1);
  }
}

start(); 