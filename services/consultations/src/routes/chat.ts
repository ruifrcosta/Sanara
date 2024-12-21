import { Router } from 'express';
import { ChatController } from '../controllers/chatController';
import { validateRequest } from '../middlewares/validateRequest';
import { sendMessageSchema } from '../validators/chatValidators';

const router = Router();
const chatController = new ChatController();

// Send message
router.post(
  '/messages',
  validateRequest(sendMessageSchema),
  chatController.sendMessage.bind(chatController)
);

// Get messages
router.get(
  '/consultations/:consultationId/messages',
  chatController.getMessages.bind(chatController)
);

// Delete message
router.delete(
  '/messages/:messageId',
  chatController.deleteMessage.bind(chatController)
);

// Join room
router.post(
  '/consultations/:consultationId/join',
  chatController.joinRoom.bind(chatController)
);

// Leave room
router.post(
  '/consultations/:consultationId/leave',
  chatController.leaveRoom.bind(chatController)
);

export const chatRoutes = router; 