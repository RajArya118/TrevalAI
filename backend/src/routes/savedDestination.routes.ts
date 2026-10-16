import { Router } from 'express';
import { SavedDestinationController } from '../controllers/savedDestination.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.get('/', SavedDestinationController.getUserSaved);
router.post('/toggle', SavedDestinationController.toggle);

export default router;
