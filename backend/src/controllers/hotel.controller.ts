import { Request, Response, NextFunction } from 'express';
import { HotelService } from '../services/hotel.service.js';

export class HotelController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await HotelService.getAll(req.query as any);
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
      const hotels = await HotelService.getFeatured();
      res.status(200).json({
        success: true,
        data: { hotels },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const hotel = await HotelService.getById(req.params.id as string);
      res.status(200).json({
        success: true,
        data: { hotel },
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const hotel = await HotelService.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Hotel created successfully',
        data: { hotel },
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const hotel = await HotelService.update(req.params.id as string, req.body);
      res.status(200).json({
        success: true,
        message: 'Hotel updated successfully',
        data: { hotel },
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await HotelService.delete(req.params.id as string);
      res.status(200).json({
        success: true,
        message: 'Hotel deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
