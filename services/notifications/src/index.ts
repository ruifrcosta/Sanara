import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { errorHandler } from './middlewares/errorHandler';
import { notificationRoutes } from './routes/notifications';
import { preferenceRoutes } from './routes/preferences';
import { templateRoutes } from './routes/templates';
import { setupMessageQueue } from './queue/setup';
import { startNotificationProcessor } from './queue/processor';
import { logger } from './utils/logger';

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
app.use('/notifications', notificationRoutes);
app.use('/preferences', preferenceRoutes);
app.use('/templates', templateRoutes);

// Error handling
app.use(errorHandler);

// Start server and message queue
const PORT = config.port;
Promise.all([
  new Promise<void>((resolve) => {
    app.listen(PORT, () => {
      logger.info(`Notifications service running on port ${PORT}`);
      resolve();
    });
  }),
  setupMessageQueue(),
])
  .then(() => {
    logger.info('Notifications service fully initialized');
    startNotificationProcessor();
  })
  .catch((error) => {
    logger.error('Failed to initialize notifications service:', error);
    process.exit(1);
  }); 