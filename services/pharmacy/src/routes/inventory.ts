import { Router } from 'express';
import { InventoryController } from '../controllers/inventoryController';
import { validateRequest } from '../middlewares/validateRequest';
import {
  addInventoryItemSchema,
  updateInventoryItemSchema,
  bulkUpdateInventorySchema,
  inventoryParamsSchema,
  listInventoryQuerySchema,
  checkAvailabilitySchema
} from '../validators/inventoryValidators';

const router = Router();
const inventoryController = new InventoryController();

// Add inventory item
router.post(
  '/pharmacies/:pharmacyId/inventory',
  validateRequest({ pharmacyId: inventoryParamsSchema.shape.pharmacyId }, 'params'),
  validateRequest(addInventoryItemSchema),
  inventoryController.addInventoryItem.bind(inventoryController)
);

// Update inventory item
router.put(
  '/pharmacies/:pharmacyId/inventory/:productId',
  validateRequest(inventoryParamsSchema, 'params'),
  validateRequest(updateInventoryItemSchema),
  inventoryController.updateInventoryItem.bind(inventoryController)
);

// Bulk update inventory
router.post(
  '/pharmacies/:pharmacyId/inventory/bulk',
  validateRequest({ pharmacyId: inventoryParamsSchema.shape.pharmacyId }, 'params'),
  validateRequest(bulkUpdateInventorySchema),
  inventoryController.bulkUpdateInventory.bind(inventoryController)
);

// Get inventory item
router.get(
  '/pharmacies/:pharmacyId/inventory/:productId',
  validateRequest(inventoryParamsSchema, 'params'),
  inventoryController.getInventoryItem.bind(inventoryController)
);

// List pharmacy inventory
router.get(
  '/pharmacies/:pharmacyId/inventory',
  validateRequest({ pharmacyId: inventoryParamsSchema.shape.pharmacyId }, 'params'),
  validateRequest(listInventoryQuerySchema, 'query'),
  inventoryController.listPharmacyInventory.bind(inventoryController)
);

// Check availability
router.post(
  '/pharmacies/:pharmacyId/inventory/check-availability',
  validateRequest({ pharmacyId: inventoryParamsSchema.shape.pharmacyId }, 'params'),
  validateRequest(checkAvailabilitySchema),
  inventoryController.checkAvailability.bind(inventoryController)
);

export const inventoryRoutes = router; 