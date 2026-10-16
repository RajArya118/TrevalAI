import { Request, Response, NextFunction } from 'express';
import { SavedDestinationService } from '../services/savedDestination.service.js';

export class SavedDestinationController {
  static async getUserSaved(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const saved = await SavedDestinationService.getUserSaved(req.user!.id);
      res.status(200).json({
        success: true,
        data: { saved },
      });
    } catch (error) {
      next(error);
    }
  }

  static async toggle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { destinationId } = req.body;
      const result = await SavedDestinationService.toggle(req.user!.id, destinationId);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
