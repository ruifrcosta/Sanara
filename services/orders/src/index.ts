import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { orderRoutes } from './routes/orders';
import { errorHandler } from './middlewares/errorHandler';
import { logger } from './utils/logger';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: config.cors.origin
}));
app.use(express.json());

// Routes
app.use('/api/orders', orderRoutes);

// Error handling
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  logger.info(`Orders service listening on port ${config.port}`);
}); 