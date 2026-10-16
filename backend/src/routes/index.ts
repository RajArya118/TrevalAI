import { Router } from 'express';
import authRoutes from './auth.routes.js';
import destinationRoutes from './destination.routes.js';
import hotelRoutes from './hotel.routes.js';
import tripRoutes from './trip.routes.js';
import savedDestinationRoutes from './savedDestination.routes.js';
import aiRoutes from './ai.routes.js';
import adminRoutes from './admin.routes.js';
import healthRoutes from './health.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/destinations', destinationRoutes);
router.use('/hotels', hotelRoutes);
router.use('/trips', tripRoutes);
router.use('/saved', savedDestinationRoutes);
router.use('/ai', aiRoutes);
router.use('/admin', adminRoutes);
router.use('/health', healthRoutes);

export default router;
