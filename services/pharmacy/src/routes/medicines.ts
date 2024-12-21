import { Router } from 'express';
import { MedicineController } from '../controllers/medicineController';
import { validateRequest } from '../middlewares/validateRequest';
import {
  createMedicineSchema,
  updateMedicineSchema,
  medicineParamsSchema,
  pharmacyMedicineParamsSchema,
  addMedicineToPharmacySchema,
  updatePharmacyMedicineSchema,
  listMedicinesQuerySchema,
  searchMedicinesQuerySchema
} from '../validators/medicineValidators';

const router = Router();
const medicineController = new MedicineController();

// Create medicine
router.post(
  '/',
  validateRequest(createMedicineSchema),
  medicineController.createMedicine.bind(medicineController)
);

// Update medicine
router.put(
  '/:medicineId',
  validateRequest(medicineParamsSchema, 'params'),
  validateRequest(updateMedicineSchema),
  medicineController.updateMedicine.bind(medicineController)
);

// Get medicine
router.get(
  '/:medicineId',
  validateRequest(medicineParamsSchema, 'params'),
  medicineController.getMedicine.bind(medicineController)
);

// List medicines
router.get(
  '/',
  validateRequest(listMedicinesQuerySchema, 'query'),
  medicineController.listMedicines.bind(medicineController)
);

// Delete medicine
router.delete(
  '/:medicineId',
  validateRequest(medicineParamsSchema, 'params'),
  medicineController.deleteMedicine.bind(medicineController)
);

// Add medicine to pharmacy
router.post(
  '/pharmacies/:pharmacyId/medicines/:medicineId',
  validateRequest(pharmacyMedicineParamsSchema, 'params'),
  validateRequest(addMedicineToPharmacySchema),
  medicineController.addMedicineToPharmacy.bind(medicineController)
);

// Update pharmacy medicine
router.put(
  '/pharmacies/:pharmacyId/medicines/:medicineId',
  validateRequest(pharmacyMedicineParamsSchema, 'params'),
  validateRequest(updatePharmacyMedicineSchema),
  medicineController.updatePharmacyMedicine.bind(medicineController)
);

// Remove medicine from pharmacy
router.delete(
  '/pharmacies/:pharmacyId/medicines/:medicineId',
  validateRequest(pharmacyMedicineParamsSchema, 'params'),
  medicineController.removeMedicineFromPharmacy.bind(medicineController)
);

// Search medicines
router.get(
  '/search',
  validateRequest(searchMedicinesQuerySchema, 'query'),
  medicineController.searchMedicines.bind(medicineController)
);

export const medicineRoutes = router; 