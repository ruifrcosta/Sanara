import { Router } from 'express';
import { PreferenceController } from '../controllers/preferenceController';
import { validateRequest } from '../middlewares/validateRequest';
import { updatePreferencesSchema, updateFCMTokenSchema, verifyPhoneNumberSchema } from '../validators/preferenceValidators';

const router = Router();
const preferenceController = new PreferenceController();

// Get preferences
router.get(
  '/users/:userId',
  preferenceController.getPreferences.bind(preferenceController)
);

// Update preferences
router.put(
  '/users/:userId',
  validateRequest(updatePreferencesSchema),
  preferenceController.updatePreferences.bind(preferenceController)
);

// Update FCM token
router.put(
  '/users/:userId/fcm-token',
  validateRequest(updateFCMTokenSchema),
  preferenceController.updateFCMToken.bind(preferenceController)
);

// Verify phone number
router.post(
  '/verify-phone',
  validateRequest(verifyPhoneNumberSchema),
  preferenceController.verifyPhoneNumber.bind(preferenceController)
);

export const preferenceRoutes = router; 