import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { config } from './config';
import { errorHandler } from './middlewares/errorHandler';
import { consultationRoutes } from './routes/consultations';
import { chatRoutes } from './routes/chat';
import { setupWebSocket } from './websocket/setup';
import { logger } from './utils/logger';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: config.cors.origin,
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
app.use('/consultations', consultationRoutes);
app.use('/chat', chatRoutes);

// Error handling
app.use(errorHandler);

// Setup WebSocket
setupWebSocket(io);

// Start server
const PORT = config.port;
httpServer.listen(PORT, () => {
  logger.info(`Consultations service running on port ${PORT}`);
}); 