import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validateServiceAuth } from '../middlewares/serviceAuth.middleware';

const router = Router();
const userController = new UserController();

// Public routes
router.get('/validate-token', authenticate, userController.validateToken);

// Protected routes
router.get('/me', authenticate, userController.getProfile);
router.put('/me', authenticate, userController.updateProfile);
router.put('/me/password', authenticate, userController.changePassword);

// Admin routes
router.get('/', authenticate, authorize('ADMIN'), userController.listUsers);
router.get('/:id', authenticate, authorize('ADMIN'), userController.getUser);
router.put('/:id', authenticate, authorize('ADMIN'), userController.updateUser);
router.delete('/:id', authenticate, authorize('ADMIN'), userController.deleteUser);

// Service routes
router.get('/service/validate', validateServiceAuth, userController.validateUser);
router.get('/service/info/:id', validateServiceAuth, userController.getUserInfo);

export default router; 