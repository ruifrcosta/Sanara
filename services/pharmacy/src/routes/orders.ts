import { Router } from 'express';
import { PharmacyOrderController } from '../controllers/orderController';
import { validateRequest } from '../middlewares/validateRequest';
import {
  createPharmacyOrderSchema,
  updatePharmacyOrderSchema,
  orderParamsSchema,
  listOrdersQuerySchema
} from '../validators/orderValidators';

const router = Router();
const orderController = new PharmacyOrderController();

// Create order
router.post(
  '/pharmacies/:pharmacyId/orders',
  validateRequest({ pharmacyId: orderParamsSchema.shape.pharmacyId }, 'params'),
  validateRequest(createPharmacyOrderSchema),
  orderController.createOrder.bind(orderController)
);

// Update order
router.put(
  '/pharmacies/:pharmacyId/orders/:orderId',
  validateRequest(orderParamsSchema, 'params'),
  validateRequest(updatePharmacyOrderSchema),
  orderController.updateOrder.bind(orderController)
);

// Get order
router.get(
  '/pharmacies/:pharmacyId/orders/:orderId',
  validateRequest(orderParamsSchema, 'params'),
  orderController.getOrder.bind(orderController)
);

// List pharmacy orders
router.get(
  '/pharmacies/:pharmacyId/orders',
  validateRequest({ pharmacyId: orderParamsSchema.shape.pharmacyId }, 'params'),
  validateRequest(listOrdersQuerySchema, 'query'),
  orderController.listPharmacyOrders.bind(orderController)
);

// Cancel order
router.post(
  '/pharmacies/:pharmacyId/orders/:orderId/cancel',
  validateRequest(orderParamsSchema, 'params'),
  orderController.cancelOrder.bind(orderController)
);

export const orderRoutes = router; 