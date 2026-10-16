import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Admin protection applied to all routes in this file
router.use(authenticateToken, requireAdmin);

router.get('/analytics', AdminController.getAnalytics);
router.get('/users', AdminController.getUsers);
router.put('/users/:id/role', AdminController.updateUserRole);
router.delete('/users/:id', AdminController.deleteUser);

export default router;
