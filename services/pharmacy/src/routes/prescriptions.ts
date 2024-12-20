import { Router } from 'express';
import { PrescriptionController } from '../controllers/prescriptionController';
import { validateRequest } from '../middlewares/validateRequest';
import {
  createPrescriptionSchema,
  updatePrescriptionSchema,
  prescriptionParamsSchema,
  listPrescriptionsQuerySchema,
  userPrescriptionsParamsSchema,
  pharmacyPrescriptionsParamsSchema
} from '../validators/prescriptionValidators';

const router = Router();
const prescriptionController = new PrescriptionController();

// Create prescription
router.post(
  '/',
  validateRequest(createPrescriptionSchema),
  prescriptionController.createPrescription.bind(prescriptionController)
);

// Update prescription
router.put(
  '/:prescriptionId',
  validateRequest(prescriptionParamsSchema, 'params'),
  validateRequest(updatePrescriptionSchema),
  prescriptionController.updatePrescription.bind(prescriptionController)
);

// Get prescription
router.get(
  '/:prescriptionId',
  validateRequest(prescriptionParamsSchema, 'params'),
  prescriptionController.getPrescription.bind(prescriptionController)
);

// List user prescriptions
router.get(
  '/users/:userId',
  validateRequest(userPrescriptionsParamsSchema, 'params'),
  validateRequest(listPrescriptionsQuerySchema, 'query'),
  prescriptionController.listUserPrescriptions.bind(prescriptionController)
);

// List pharmacy prescriptions
router.get(
  '/pharmacies/:pharmacyId',
  validateRequest(pharmacyPrescriptionsParamsSchema, 'params'),
  validateRequest(listPrescriptionsQuerySchema, 'query'),
  prescriptionController.listPharmacyPrescriptions.bind(prescriptionController)
);

export const prescriptionRoutes = router; 