import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { errorHandler } from './middlewares/errorHandler';
import { userRoutes } from './routes/users';
import { familyRoutes } from './routes/families';
import { logger } from './utils/logger';

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
app.use('/users', userRoutes);
app.use('/families', familyRoutes);

// Error handling
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  logger.info(`Users service running on port ${PORT}`);
}); 