import { Server, Socket } from 'socket.io';
import { logger } from '../utils/logger';

export let io: Server;

export function setupWebSocket(socketServer: Server) {
  io = socketServer;

  io.on('connection', (socket: Socket) => {
    logger.info('Client connected', { socketId: socket.id });

    socket.on('consultation:join', (consultationId: string) => {
      socket.join(consultationId);
      logger.info('Client joined consultation room', { socketId: socket.id, consultationId });
    });

    socket.on('consultation:leave', (consultationId: string) => {
      socket.leave(consultationId);
      logger.info('Client left consultation room', { socketId: socket.id, consultationId });
    });

    socket.on('chat:typing', (data: { consultationId: string; userId: string }) => {
      socket.to(data.consultationId).emit('chat:typing', {
        userId: data.userId,
        isTyping: true
      });
    });

    socket.on('chat:stopTyping', (data: { consultationId: string; userId: string }) => {
      socket.to(data.consultationId).emit('chat:typing', {
        userId: data.userId,
        isTyping: false
      });
    });

    socket.on('video:ready', (data: { consultationId: string; userId: string }) => {
      socket.to(data.consultationId).emit('video:peerReady', {
        userId: data.userId
      });
    });

    socket.on('disconnect', () => {
      logger.info('Client disconnected', { socketId: socket.id });
    });
  });

  logger.info('WebSocket server initialized');
} 