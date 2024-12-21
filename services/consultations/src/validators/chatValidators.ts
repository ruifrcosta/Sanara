import { z } from 'zod';

export const sendMessageSchema = z.object({
  consultationId: z.string().uuid('Invalid consultation ID'),
  senderId: z.string().uuid('Invalid sender ID'),
  senderType: z.enum(['USER', 'PROFESSIONAL'], {
    errorMap: () => ({ message: 'Sender type must be either USER or PROFESSIONAL' })
  }),
  content: z.string().min(1, 'Message content cannot be empty'),
});

export const joinRoomSchema = z.object({
  socketId: z.string().min(1, 'Socket ID is required'),
});

export const leaveRoomSchema = z.object({
  socketId: z.string().min(1, 'Socket ID is required'),
}); 