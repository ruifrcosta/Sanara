import twilio from 'twilio';
import { config } from '../config';
import { logger } from '../utils/logger';

const AccessToken = twilio.jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

export class TwilioService {
  private client: twilio.Twilio;

  constructor() {
    this.client = twilio(
      config.twilio.accountSid,
      config.twilio.authToken
    );
  }

  async createRoom(uniqueName: string) {
    try {
      const room = await this.client.video.v1.rooms.create({
        uniqueName,
        type: 'group',
        recordParticipantsOnConnect: true
      });

      logger.info('Video room created successfully', { roomSid: room.sid });
      return room.sid;
    } catch (error) {
      logger.error('Failed to create video room:', error);
      throw error;
    }
  }

  generateToken(roomId: string, identity: string) {
    try {
      const token = new AccessToken(
        config.twilio.accountSid,
        config.twilio.apiKey,
        config.twilio.apiSecret,
        { identity }
      );

      const videoGrant = new VideoGrant({
        room: roomId
      });

      token.addGrant(videoGrant);
      return token.toJwt();
    } catch (error) {
      logger.error('Failed to generate video token:', error);
      throw error;
    }
  }

  async endRoom(roomSid: string) {
    try {
      await this.client.video.v1.rooms(roomSid).update({ status: 'completed' });
      logger.info('Video room ended successfully', { roomSid });
    } catch (error) {
      logger.error('Failed to end video room:', error);
      throw error;
    }
  }

  async getRoomParticipants(roomSid: string) {
    try {
      const participants = await this.client.video.v1.rooms(roomSid).participants.list();
      return participants.map(participant => ({
        identity: participant.identity,
        status: participant.status,
        duration: participant.duration
      }));
    } catch (error) {
      logger.error('Failed to get room participants:', error);
      throw error;
    }
  }

  async getRoomRecording(roomSid: string) {
    try {
      const recordings = await this.client.video.v1.rooms(roomSid).recordings.list();
      return recordings.map(recording => ({
        sid: recording.sid,
        duration: recording.duration,
        url: recording.links.media
      }));
    } catch (error) {
      logger.error('Failed to get room recording:', error);
      throw error;
    }
  }
} 