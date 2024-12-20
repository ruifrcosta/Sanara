import { Twilio } from 'twilio';

export interface TwilioConfig {
  accountSid: string;
  authToken: string;
  apiKey: string;
  apiSecret: string;
  roomType: 'group' | 'peer-to-peer';
}

export interface TwilioRoom {
  sid: string;
  uniqueName: string;
  status: 'in-progress' | 'completed' | 'failed';
  type: 'group' | 'peer-to-peer';
  maxParticipants: number;
  duration: number;
  createdAt: Date;
  endedAt?: Date;
}

export interface TwilioParticipant {
  sid: string;
  identity: string;
  roomSid: string;
  status: 'connected' | 'disconnected';
  startTime: Date;
  endTime?: Date;
}

export interface TwilioRecording {
  sid: string;
  roomSid: string;
  type: 'audio' | 'video' | 'data';
  status: 'processing' | 'completed' | 'failed';
  duration: number;
  url: string;
  size: number;
  createdAt: Date;
}

export interface TwilioTranscription {
  sid: string;
  recordingSid: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  text: string;
  duration: number;
  createdAt: Date;
}

export interface TwilioClients {
  client: Twilio;
  video: Twilio.Video.V1;
} 