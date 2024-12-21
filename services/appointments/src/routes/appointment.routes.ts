import { Router } from 'express';
import { AppointmentController } from '../controllers/appointment.controller';

const router = Router();
const appointmentController = new AppointmentController();

// Create new appointment
router.post('/', appointmentController.create);

// Get all appointments with optional filters
router.get('/', appointmentController.getAll);

// Get specific appointment
router.get('/:id', appointmentController.getById);

// Update appointment status
router.patch('/:id/status', appointmentController.updateStatus);

// Cancel appointment
router.post('/:id/cancel', appointmentController.cancel);

export default router; 