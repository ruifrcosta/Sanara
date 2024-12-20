import { PrismaClient, Consultation } from '@prisma/client';
import { AppError } from '../middlewares/errorHandler';
import { logger } from '../utils/logger';
import { config } from '../config';
import { TwilioService } from './twilioService';
import { AIService } from '../ai/aiService';

const prisma = new PrismaClient();
const twilioService = new TwilioService();
const aiService = new AIService();

export interface StartConsultationData {
  appointmentId: string;
  userId: string;
  professionalId: string;
  type: 'VIDEO_CALL' | 'CHAT';
}

export interface UpdateConsultationData {
  status?: 'WAITING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
}

export class ConsultationService {
  async startConsultation(data: StartConsultationData) {
    try {
      // Check if consultation already exists
      const existingConsultation = await prisma.consultation.findUnique({
        where: { appointmentId: data.appointmentId }
      });

      if (existingConsultation) {
        throw new AppError(400, 'Consultation already exists for this appointment');
      }

      let roomId: string | undefined;
      if (data.type === 'VIDEO_CALL') {
        roomId = await twilioService.createRoom(data.appointmentId);
      }

      const consultation = await prisma.consultation.create({
        data: {
          appointmentId: data.appointmentId,
          userId: data.userId,
          professionalId: data.professionalId,
          startTime: new Date(),
          status: 'WAITING',
          type: data.type,
          roomId
        }
      });

      logger.info('Consultation started successfully', { consultationId: consultation.id });
      return consultation;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Failed to start consultation:', error);
      throw new AppError(500, 'Failed to start consultation');
    }
  }

  async updateConsultation(consultationId: string, data: UpdateConsultationData) {
    try {
      const consultation = await prisma.consultation.update({
        where: { id: consultationId },
        data: {
          status: data.status,
          notes: data.notes,
          endTime: data.status === 'COMPLETED' ? new Date() : undefined
        }
      });

      if (data.status === 'COMPLETED') {
        // Generate transcript and summary using AI
        await this.generateAIContent(consultation);
      }

      logger.info('Consultation updated successfully', { consultationId });
      return consultation;
    } catch (error) {
      logger.error('Failed to update consultation:', error);
      throw new AppError(400, 'Failed to update consultation');
    }
  }

  async getConsultation(consultationId: string) {
    try {
      const consultation = await prisma.consultation.findUnique({
        where: { id: consultationId },
        include: {
          chatMessages: true
        }
      });

      if (!consultation) {
        throw new AppError(404, 'Consultation not found');
      }

      return consultation;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Failed to get consultation:', error);
      throw new AppError(500, 'Failed to get consultation');
    }
  }

  async listUserConsultations(userId: string) {
    try {
      const consultations = await prisma.consultation.findMany({
        where: { userId },
        include: {
          chatMessages: true
        },
        orderBy: {
          startTime: 'desc'
        }
      });

      return consultations;
    } catch (error) {
      logger.error('Failed to list user consultations:', error);
      throw new AppError(500, 'Failed to list consultations');
    }
  }

  async listProfessionalConsultations(professionalId: string) {
    try {
      const consultations = await prisma.consultation.findMany({
        where: { professionalId },
        include: {
          chatMessages: true
        },
        orderBy: {
          startTime: 'desc'
        }
      });

      return consultations;
    } catch (error) {
      logger.error('Failed to list professional consultations:', error);
      throw new AppError(500, 'Failed to list consultations');
    }
  }

  async generateVideoToken(consultationId: string, userId: string) {
    try {
      const consultation = await prisma.consultation.findUnique({
        where: { id: consultationId }
      });

      if (!consultation) {
        throw new AppError(404, 'Consultation not found');
      }

      if (!consultation.roomId) {
        throw new AppError(400, 'This consultation does not have a video room');
      }

      const token = twilioService.generateToken(consultation.roomId, userId);
      return { token, roomId: consultation.roomId };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Failed to generate video token:', error);
      throw new AppError(500, 'Failed to generate video token');
    }
  }

  private async generateAIContent(consultation: Consultation) {
    try {
      // Get chat messages for the consultation
      const messages = await prisma.chatMessage.findMany({
        where: { consultationId: consultation.id },
        orderBy: { timestamp: 'asc' }
      });

      // Generate transcript
      const transcript = await aiService.generateTranscript(messages);
      await prisma.aIAssistant.create({
        data: {
          consultationId: consultation.id,
          type: 'TRANSCRIPTION',
          content: transcript,
          status: 'COMPLETED'
        }
      });

      // Generate summary
      const summary = await aiService.generateSummary(transcript);
      await prisma.aIAssistant.create({
        data: {
          consultationId: consultation.id,
          type: 'SUMMARY',
          content: summary,
          status: 'COMPLETED'
        }
      });

      // Update consultation with transcript and summary
      await prisma.consultation.update({
        where: { id: consultation.id },
        data: {
          transcript,
          summary
        }
      });

      logger.info('AI content generated successfully', { consultationId: consultation.id });
    } catch (error) {
      logger.error('Failed to generate AI content:', error);
      // Don't throw error here, as the consultation was completed successfully
    }
  }
} 