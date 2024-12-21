import { Request, Response, NextFunction } from 'express';
import { ChatService, SendMessageData } from '../services/chatService';
import { logger } from '../utils/logger';

const chatService = new ChatService();

export class ChatController {
  async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const messageData: SendMessageData = req.body;
      const message = await chatService.sendMessage(messageData);
      
      logger.info('Chat message sent successfully');
      res.status(201).json(message);
    } catch (error) {
      next(error);
    }
  }

  async getMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const consultationId = req.params.consultationId;
      const messages = await chatService.getMessages(consultationId);
      
      logger.info('Chat messages retrieved successfully');
      res.json(messages);
    } catch (error) {
      next(error);
    }
  }

  async deleteMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const messageId = req.params.messageId;
      const senderId = req.body.senderId;
      await chatService.deleteMessage(messageId, senderId);
      
      logger.info('Chat message deleted successfully');
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async joinRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const { consultationId } = req.params;
      const { socketId } = req.body;
      await chatService.joinRoom(consultationId, socketId);
      
      logger.info('User joined chat room successfully');
      res.status(200).send();
    } catch (error) {
      next(error);
    }
  }

  async leaveRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const { consultationId } = req.params;
      const { socketId } = req.body;
      await chatService.leaveRoom(consultationId, socketId);
      
      logger.info('User left chat room successfully');
      res.status(200).send();
    } catch (error) {
      next(error);
    }
  }
} 