import { Router } from 'express';
import { ProfessionalController } from '../controllers/professionalController';
import { validateRequest } from '../middlewares/validateRequest';
import { createProfessionalSchema, updateProfessionalSchema, updateAvailabilitySchema } from '../validators/professionalValidators';

const router = Router();
const professionalController = new ProfessionalController();

// Create professional
router.post(
  '/',
  validateRequest(createProfessionalSchema),
  professionalController.createProfessional.bind(professionalController)
);

// Update professional
router.put(
  '/:professionalId',
  validateRequest(updateProfessionalSchema),
  professionalController.updateProfessional.bind(professionalController)
);

// Get professional
router.get(
  '/:professionalId',
  professionalController.getProfessional.bind(professionalController)
);

// List professionals
router.get(
  '/',
  professionalController.listProfessionals.bind(professionalController)
);

// Update professional availability
router.put(
  '/:professionalId/availability',
  validateRequest(updateAvailabilitySchema),
  professionalController.updateAvailability.bind(professionalController)
);

// Get available slots
router.get(
  '/:professionalId/available-slots',
  professionalController.getAvailableSlots.bind(professionalController)
);

export const professionalRoutes = router; 