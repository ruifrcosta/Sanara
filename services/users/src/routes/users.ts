import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { validateRequest } from '../middlewares/validateRequest';
import { createUserSchema, updateUserSchema } from '../validators/userValidators';

const router = Router();
const userController = new UserController();

// Create user
router.post(
  '/',
  validateRequest(createUserSchema),
  userController.createUser.bind(userController)
);

// Update user
router.put(
  '/:userId',
  validateRequest(updateUserSchema),
  userController.updateUser.bind(userController)
);

// Get user
router.get(
  '/:userId',
  userController.getUser.bind(userController)
);

// Delete user
router.delete(
  '/:userId',
  userController.deleteUser.bind(userController)
);

// List users
router.get(
  '/',
  userController.listUsers.bind(userController)
);

export const userRoutes = router; 