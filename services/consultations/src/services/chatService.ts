import { PrismaClient, ChatMessage } from '@prisma/client';
import { AppError } from '../middlewares/errorHandler';
import { logger } from '../utils/logger';
import { io } from '../websocket/setup';

const prisma = new PrismaClient();

export interface SendMessageData {
  consultationId: string;
  senderId: string;
  senderType: 'USER' | 'PROFESSIONAL';
  content: string;
}

export class ChatService {
  async sendMessage(data: SendMessageData) {
    try {
      // Check if consultation exists and is active
      const consultation = await prisma.consultation.findUnique({
        where: { id: data.consultationId }
      });

      if (!consultation) {
        throw new AppError(404, 'Consultation not found');
      }

      if (consultation.status !== 'IN_PROGRESS') {
        throw new AppError(400, 'Cannot send messages in a consultation that is not in progress');
      }

      // Create message
      const message = await prisma.chatMessage.create({
        data: {
          consultationId: data.consultationId,
          senderId: data.senderId,
          senderType: data.senderType,
          content: data.content
        }
      });

      // Emit message to all participants in the consultation room
      io.to(data.consultationId).emit('chat:message', {
        id: message.id,
        senderId: message.senderId,
        senderType: message.senderType,
        content: message.content,
        timestamp: message.timestamp
      });

      logger.info('Chat message sent successfully', { messageId: message.id });
      return message;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Failed to send chat message:', error);
      throw new AppError(500, 'Failed to send chat message');
    }
  }

  async getMessages(consultationId: string) {
    try {
      const messages = await prisma.chatMessage.findMany({
        where: { consultationId },
        orderBy: { timestamp: 'asc' }
      });

      return messages;
    } catch (error) {
      logger.error('Failed to get chat messages:', error);
      throw new AppError(500, 'Failed to get chat messages');
    }
  }

  async deleteMessage(messageId: string, senderId: string) {
    try {
      const message = await prisma.chatMessage.findUnique({
        where: { id: messageId }
      });

      if (!message) {
        throw new AppError(404, 'Message not found');
      }

      if (message.senderId !== senderId) {
        throw new AppError(403, 'Cannot delete messages from other users');
      }

      await prisma.chatMessage.delete({
        where: { id: messageId }
      });

      // Emit message deletion to all participants
      io.to(message.consultationId).emit('chat:messageDeleted', {
        messageId
      });

      logger.info('Chat message deleted successfully', { messageId });
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Failed to delete chat message:', error);
      throw new AppError(500, 'Failed to delete chat message');
    }
  }

  async joinRoom(consultationId: string, socketId: string) {
    try {
      const consultation = await prisma.consultation.findUnique({
        where: { id: consultationId }
      });

      if (!consultation) {
        throw new AppError(404, 'Consultation not found');
      }

      // Join the socket to the consultation room
      const socket = io.sockets.sockets.get(socketId);
      if (socket) {
        socket.join(consultationId);
        logger.info('User joined chat room', { consultationId, socketId });
      }
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Failed to join chat room:', error);
      throw new AppError(500, 'Failed to join chat room');
    }
  }

  async leaveRoom(consultationId: string, socketId: string) {
    try {
      // Leave the consultation room
      const socket = io.sockets.sockets.get(socketId);
      if (socket) {
        socket.leave(consultationId);
        logger.info('User left chat room', { consultationId, socketId });
      }
    } catch (error) {
      logger.error('Failed to leave chat room:', error);
      throw new AppError(500, 'Failed to leave chat room');
    }
  }
} 