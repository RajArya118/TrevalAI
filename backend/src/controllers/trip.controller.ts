import { Request, Response, NextFunction } from 'express';
import { TripService } from '../services/trip.service.js';

export class TripController {
  static async getUserTrips(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const trips = await TripService.getUserTrips(req.user!.id);
      res.status(200).json({
        success: true,
        data: { trips },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const trip = await TripService.getById(req.params.id as string, req.user!.id, req.user!.role);
      res.status(200).json({
        success: true,
        data: { trip },
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const trip = await TripService.create(req.user!.id, req.body);
      res.status(201).json({
        success: true,
        message: 'Trip itinerary saved successfully',
        data: { trip },
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const trip = await TripService.update(req.params.id as string, req.user!.id, req.body, req.user!.role);
      res.status(200).json({
        success: true,
        message: 'Trip updated successfully',
        data: { trip },
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await TripService.delete(req.params.id as string, req.user!.id, req.user!.role);
      res.status(200).json({
        success: true,
        message: 'Trip deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllForAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt((req.query.page as string) || '1', 10);
      const limit = parseInt((req.query.limit as string) || '10', 10);
      const result = await TripService.getAllForAdmin(page, limit);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
