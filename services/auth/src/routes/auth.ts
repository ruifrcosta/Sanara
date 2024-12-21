import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { validateRequest } from '../middlewares/validateRequest';
import { loginSchema, registerSchema, updateUserSchema } from '../validators/authValidators';

const router = Router();
const authController = new AuthController();

// Login route
router.post(
  '/login',
  validateRequest(loginSchema),
  authController.login.bind(authController)
);

// Register route
router.post(
  '/register',
  validateRequest(registerSchema),
  authController.register.bind(authController)
);

// Get user info route
router.get(
  '/users/:userId',
  authController.getUserInfo.bind(authController)
);

// Update user info route
router.put(
  '/users/:userId',
  validateRequest(updateUserSchema),
  authController.updateUserInfo.bind(authController)
);

export const authRoutes = router; 