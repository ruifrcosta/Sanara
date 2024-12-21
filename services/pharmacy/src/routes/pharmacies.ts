import { Router } from 'express';
import { PharmacyController } from '../controllers/pharmacyController';
import { validateRequest } from '../middlewares/validateRequest';
import {
  createPharmacySchema,
  updatePharmacySchema,
  pharmacyParamsSchema,
  listPharmaciesQuerySchema,
  searchNearbyPharmaciesQuerySchema
} from '../validators/pharmacyValidators';

const router = Router();
const pharmacyController = new PharmacyController();

// Create pharmacy
router.post(
  '/',
  validateRequest(createPharmacySchema),
  pharmacyController.createPharmacy.bind(pharmacyController)
);

// Update pharmacy
router.put(
  '/:pharmacyId',
  validateRequest(pharmacyParamsSchema, 'params'),
  validateRequest(updatePharmacySchema),
  pharmacyController.updatePharmacy.bind(pharmacyController)
);

// Get pharmacy
router.get(
  '/:pharmacyId',
  validateRequest(pharmacyParamsSchema, 'params'),
  pharmacyController.getPharmacy.bind(pharmacyController)
);

// List pharmacies
router.get(
  '/',
  validateRequest(listPharmaciesQuerySchema, 'query'),
  pharmacyController.listPharmacies.bind(pharmacyController)
);

// Search nearby pharmacies
router.get(
  '/search/nearby',
  validateRequest(searchNearbyPharmaciesQuerySchema, 'query'),
  pharmacyController.searchNearbyPharmacies.bind(pharmacyController)
);

export const pharmacyRoutes = router; 