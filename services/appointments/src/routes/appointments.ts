import { Router } from 'express';
import { AppointmentController } from '../controllers/appointmentController';
import { validateRequest } from '../middlewares/validateRequest';
import { createAppointmentSchema, updateAppointmentSchema } from '../validators/appointmentValidators';

const router = Router();
const appointmentController = new AppointmentController();

// Create appointment
router.post(
  '/',
  validateRequest(createAppointmentSchema),
  appointmentController.createAppointment.bind(appointmentController)
);

// Update appointment
router.put(
  '/:appointmentId',
  validateRequest(updateAppointmentSchema),
  appointmentController.updateAppointment.bind(appointmentController)
);

// Get appointment
router.get(
  '/:appointmentId',
  appointmentController.getAppointment.bind(appointmentController)
);

// List user appointments
router.get(
  '/users/:userId',
  appointmentController.listUserAppointments.bind(appointmentController)
);

// List professional appointments
router.get(
  '/professionals/:professionalId',
  appointmentController.listProfessionalAppointments.bind(appointmentController)
);

export const appointmentRoutes = router; 