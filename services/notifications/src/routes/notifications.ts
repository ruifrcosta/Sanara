import { Router } from 'express';
import { NotificationController } from '../controllers/notificationController';
import { validateRequest } from '../middlewares/validateRequest';
import { createNotificationSchema } from '../validators/notificationValidators';

const router = Router();
const notificationController = new NotificationController();

// Create notification
router.post(
  '/',
  validateRequest(createNotificationSchema),
  notificationController.createNotification.bind(notificationController)
);

// Get notification
router.get(
  '/:notificationId',
  notificationController.getNotification.bind(notificationController)
);

// List user notifications
router.get(
  '/users/:userId',
  notificationController.listUserNotifications.bind(notificationController)
);

export const notificationRoutes = router; 