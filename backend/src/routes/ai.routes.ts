import { Router } from 'express';
import { AiController } from '../controllers/ai.controller.js';
import { validateRequest } from '../middleware/validate.js';
import { planTripAiSchema } from '../validators/ai.validator.js';
import { aiRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/plan-trip', aiRateLimiter, validateRequest(planTripAiSchema), AiController.planTrip);

export default router;
