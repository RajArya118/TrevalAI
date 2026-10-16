import { Request, Response, NextFunction } from 'express';
import { DestinationService } from '../services/destination.service.js';

export class DestinationController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const currentUserId = req.user?.id;
      const result = await DestinationService.getAll(req.query as any, currentUserId);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getFeatured(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const destinations = await DestinationService.getFeatured();
      res.status(200).json({
        success: true,
        data: { destinations },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await DestinationService.getCategories();
      res.status(200).json({
        success: true,
        data: { categories },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const currentUserId = req.user?.id;
      const destination = await DestinationService.getById(req.params.id as string, currentUserId);
      res.status(200).json({
        success: true,
        data: { destination },
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const destination = await DestinationService.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Destination created successfully',
        data: { destination },
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const destination = await DestinationService.update(req.params.id as string, req.body);
      res.status(200).json({
        success: true,
        message: 'Destination updated successfully',
        data: { destination },
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await DestinationService.delete(req.params.id as string);
      res.status(200).json({
        success: true,
        message: 'Destination deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
