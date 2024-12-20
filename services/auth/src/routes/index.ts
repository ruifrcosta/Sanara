import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import clinicRoutes from './clinic.routes';

export const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/clinics', clinicRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'auth' });
}); 