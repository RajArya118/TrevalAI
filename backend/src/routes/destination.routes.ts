import { Router } from 'express';
import { DestinationController } from '../controllers/destination.controller.js';
import { validateRequest } from '../middleware/validate.js';
import {
  createDestinationSchema,
  updateDestinationSchema,
  destinationQuerySchema,
} from '../validators/destination.validator.js';
import { authenticateToken, requireAdmin, optionalAuth } from '../middleware/auth.js';

const router = Router();

// Public routes (with optional auth to detect if saved by user)
router.get('/', optionalAuth, validateRequest(destinationQuerySchema, 'query'), DestinationController.getAll);
router.get('/featured', DestinationController.getFeatured);
router.get('/categories', DestinationController.getCategories);
router.get('/:id', optionalAuth, DestinationController.getById);

// Admin-only routes
router.post(
  '/',
  authenticateToken,
  requireAdmin,
  validateRequest(createDestinationSchema),
  DestinationController.create
);
router.put(
  '/:id',
  authenticateToken,
  requireAdmin,
  validateRequest(updateDestinationSchema),
  DestinationController.update
);
router.delete('/:id', authenticateToken, requireAdmin, DestinationController.delete);

export default router;
