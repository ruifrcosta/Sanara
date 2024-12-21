import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { mainRouter } from './routes';
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
app.use(mainRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  logger.info(`Pharmacy service listening on port ${config.port}`);
}); 