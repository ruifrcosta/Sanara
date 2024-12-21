import { Twilio } from 'twilio';
import { TwilioConfig, TwilioRoom, TwilioParticipant, TwilioRecording, TwilioTranscription } from '../types/twilio';
import { logger } from '../utils/logger';

export class TwilioService {
  private client: Twilio;
  private video: Twilio.Video.V1;
  private config: TwilioConfig;

  constructor(config: TwilioConfig) {
    this.config = config;
    this.client = new Twilio(config.accountSid, config.authToken);
    this.video = this.client.video.v1;
  }

  // Gerenciamento de Salas
  async createRoom(uniqueName: string): Promise<TwilioRoom> {
    try {
      const room = await this.video.rooms.create({
        uniqueName,
        type: this.config.roomType,
        recordParticipantsOnConnect: true,
      });

      return {
        sid: room.sid,
        uniqueName: room.uniqueName,
        status: room.status as TwilioRoom['status'],
        type: room.type as TwilioRoom['type'],
        maxParticipants: room.maxParticipants,
        duration: room.duration,
        createdAt: new Date(room.dateCreated),
        endedAt: room.dateUpdated ? new Date(room.dateUpdated) : undefined,
      };
    } catch (error) {
      logger.error('Error creating room:', error);
      throw error;
    }
  }

  async getRoom(roomSid: string): Promise<TwilioRoom> {
    try {
      const room = await this.video.rooms(roomSid).fetch();

      return {
        sid: room.sid,
        uniqueName: room.uniqueName,
        status: room.status as TwilioRoom['status'],
        type: room.type as TwilioRoom['type'],
        maxParticipants: room.maxParticipants,
        duration: room.duration,
        createdAt: new Date(room.dateCreated),
        endedAt: room.dateUpdated ? new Date(room.dateUpdated) : undefined,
      };
    } catch (error) {
      logger.error('Error getting room:', error);
      throw error;
    }
  }

  async completeRoom(roomSid: string): Promise<void> {
    try {
      await this.video.rooms(roomSid).update({ status: 'completed' });
    } catch (error) {
      logger.error('Error completing room:', error);
      throw error;
    }
  }

  // Gerenciamento de Participantes
  async getParticipants(roomSid: string): Promise<TwilioParticipant[]> {
    try {
      const participants = await this.video.rooms(roomSid).participants.list();

      return participants.map(participant => ({
        sid: participant.sid,
        identity: participant.identity,
        roomSid: participant.roomSid,
        status: participant.status as TwilioParticipant['status'],
        startTime: new Date(participant.dateCreated),
        endTime: participant.dateUpdated ? new Date(participant.dateUpdated) : undefined,
      }));
    } catch (error) {
      logger.error('Error getting participants:', error);
      throw error;
    }
  }

  async removeParticipant(roomSid: string, participantSid: string): Promise<void> {
    try {
      await this.video.rooms(roomSid).participants(participantSid).update({ status: 'disconnected' });
    } catch (error) {
      logger.error('Error removing participant:', error);
      throw error;
    }
  }

  // Gerenciamento de Gravações
  async getRecordings(roomSid: string): Promise<TwilioRecording[]> {
    try {
      const recordings = await this.video.recordings.list({ roomSid });

      return recordings.map(recording => ({
        sid: recording.sid,
        roomSid: recording.roomSid,
        type: recording.type as TwilioRecording['type'],
        status: recording.status as TwilioRecording['status'],
        duration: recording.duration,
        url: recording.url,
        size: recording.size,
        createdAt: new Date(recording.dateCreated),
      }));
    } catch (error) {
      logger.error('Error getting recordings:', error);
      throw error;
    }
  }

  async deleteRecording(recordingSid: string): Promise<void> {
    try {
      await this.video.recordings(recordingSid).remove();
    } catch (error) {
      logger.error('Error deleting recording:', error);
      throw error;
    }
  }

  // Transcrição de Áudio
  async transcribeRecording(recordingSid: string): Promise<TwilioTranscription> {
    try {
      const transcription = await this.client.transcriptions.create({
        recordingSid,
      });

      return {
        sid: transcription.sid,
        recordingSid: transcription.recordingSid,
        status: transcription.status as TwilioTranscription['status'],
        text: transcription.transcriptionText || '',
        duration: transcription.duration,
        createdAt: new Date(transcription.dateCreated),
      };
    } catch (error) {
      logger.error('Error transcribing recording:', error);
      throw error;
    }
  }

  async getTranscription(transcriptionSid: string): Promise<TwilioTranscription> {
    try {
      const transcription = await this.client.transcriptions(transcriptionSid).fetch();

      return {
        sid: transcription.sid,
        recordingSid: transcription.recordingSid,
        status: transcription.status as TwilioTranscription['status'],
        text: transcription.transcriptionText || '',
        duration: transcription.duration,
        createdAt: new Date(transcription.dateCreated),
      };
    } catch (error) {
      logger.error('Error getting transcription:', error);
      throw error;
    }
  }

  // Geração de Token de Acesso
  async generateAccessToken(identity: string, roomName: string): Promise<string> {
    try {
      const AccessToken = require('twilio').jwt.AccessToken;
      const VideoGrant = AccessToken.VideoGrant;

      const token = new AccessToken(
        this.config.accountSid,
        this.config.apiKey,
        this.config.apiSecret
      );

      token.identity = identity;

      const videoGrant = new VideoGrant({
        room: roomName,
      });

      token.addGrant(videoGrant);

      return token.toJwt();
    } catch (error) {
      logger.error('Error generating access token:', error);
      throw error;
    }
  }
} 