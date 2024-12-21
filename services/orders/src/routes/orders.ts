import { Router } from 'express';
import { OrderController } from '../controllers/orderController';
import { validateRequest } from '../middlewares/validateRequest';
import {
  createOrderSchema,
  updateOrderSchema,
  orderParamsSchema,
  listOrdersQuerySchema
} from '../validators/orderValidators';

const router = Router();
const orderController = new OrderController();

// Create order
router.post(
  '/',
  validateRequest(createOrderSchema),
  orderController.createOrder.bind(orderController)
);

// Update order
router.put(
  '/:orderId',
  validateRequest(orderParamsSchema, 'params'),
  validateRequest(updateOrderSchema),
  orderController.updateOrder.bind(orderController)
);

// Get order
router.get(
  '/:orderId',
  validateRequest(orderParamsSchema, 'params'),
  orderController.getOrder.bind(orderController)
);

// List user orders
router.get(
  '/users/:userId',
  validateRequest(listOrdersQuerySchema, 'query'),
  orderController.listUserOrders.bind(orderController)
);

// Cancel order
router.post(
  '/:orderId/cancel',
  validateRequest(orderParamsSchema, 'params'),
  orderController.cancelOrder.bind(orderController)
);

export const orderRoutes = router; 