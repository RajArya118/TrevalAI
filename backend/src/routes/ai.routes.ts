import { Router } from 'express';
import { AiController } from '../controllers/ai.controller.js';
import { validateRequest } from '../middleware/validate.js';
import { planTripAiSchema } from '../validators/ai.validator.js';

const router = Router();

router.post('/plan-trip', validateRequest(planTripAiSchema), AiController.planTrip);

export default router;
