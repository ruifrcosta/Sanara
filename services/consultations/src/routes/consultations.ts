import { Router } from 'express';
import { ConsultationController } from '../controllers/consultationController';
import { validateRequest } from '../middlewares/validateRequest';
import { startConsultationSchema, updateConsultationSchema } from '../validators/consultationValidators';

const router = Router();
const consultationController = new ConsultationController();

// Start consultation
router.post(
  '/',
  validateRequest(startConsultationSchema),
  consultationController.startConsultation.bind(consultationController)
);

// Update consultation
router.put(
  '/:consultationId',
  validateRequest(updateConsultationSchema),
  consultationController.updateConsultation.bind(consultationController)
);

// Get consultation
router.get(
  '/:consultationId',
  consultationController.getConsultation.bind(consultationController)
);

// List user consultations
router.get(
  '/users/:userId',
  consultationController.listUserConsultations.bind(consultationController)
);

// List professional consultations
router.get(
  '/professionals/:professionalId',
  consultationController.listProfessionalConsultations.bind(consultationController)
);

// Generate video token
router.post(
  '/:consultationId/video-token',
  consultationController.generateVideoToken.bind(consultationController)
);

// Analyze symptoms
router.post(
  '/analyze-symptoms',
  consultationController.analyzeSymptoms.bind(consultationController)
);

// Generate medical report
router.post(
  '/:consultationId/medical-report',
  consultationController.generateMedicalReport.bind(consultationController)
);

// Suggest prescription
router.post(
  '/suggest-prescription',
  consultationController.suggestPrescription.bind(consultationController)
);

export const consultationRoutes = router; 