import { Router } from 'express';
import { pharmacyRoutes } from './pharmacies';
import { inventoryRoutes } from './inventory';
import { orderRoutes } from './orders';

const router = Router();

// Mount routes
router.use('/api', pharmacyRoutes);
router.use('/api', inventoryRoutes);
router.use('/api', orderRoutes);

export const mainRouter = router; 