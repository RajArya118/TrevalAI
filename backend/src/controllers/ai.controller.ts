import { Request, Response, NextFunction } from 'express';
import { AiService } from '../services/ai.service.js';

export class AiController {
  static async planTrip(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const itinerary = await AiService.planTrip(req.body);
      res.status(200).json({
        success: true,
        message: itinerary.isDemo
          ? 'Generated travel itinerary via TravelAI Demo Engine'
          : 'Generated travel itinerary via Google Gemini API',
        data: itinerary,
      });
    } catch (error) {
      next(error);
    }
  }
}
