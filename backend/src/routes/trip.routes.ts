import { Router } from 'express';
import { TripController } from '../controllers/trip.controller.js';
import { validateRequest } from '../middleware/validate.js';
import { createTripSchema, updateTripSchema } from '../validators/trip.validator.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = Router();

// All trip routes require authentication
router.use(authenticateToken);

// User Trips
router.get('/', TripController.getUserTrips);
router.post('/', validateRequest(createTripSchema), TripController.create);
router.get('/:id', TripController.getById);
router.put('/:id', validateRequest(updateTripSchema), TripController.update);
router.delete('/:id', TripController.delete);

// Admin Trip Oversight
router.get('/admin/all', requireAdmin, TripController.getAllForAdmin);

export default router;
