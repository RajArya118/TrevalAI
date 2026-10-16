import { Router } from 'express';
import { HotelController } from '../controllers/hotel.controller.js';
import { validateRequest } from '../middleware/validate.js';
import {
  createHotelSchema,
  updateHotelSchema,
  hotelQuerySchema,
} from '../validators/hotel.validator.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/', validateRequest(hotelQuerySchema, 'query'), HotelController.getAll);
router.get('/featured', HotelController.getFeatured);
router.get('/:id', HotelController.getById);

// Admin-only routes
router.post(
  '/',
  authenticateToken,
  requireAdmin,
  validateRequest(createHotelSchema),
  HotelController.create
);
router.put(
  '/:id',
  authenticateToken,
  requireAdmin,
  validateRequest(updateHotelSchema),
  HotelController.update
);
router.delete('/:id', authenticateToken, requireAdmin, HotelController.delete);

export default router;
