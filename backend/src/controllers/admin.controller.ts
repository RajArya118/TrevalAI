import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service.js';

export class AdminController {
  static async getAnalytics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const analytics = await AdminService.getAnalytics();
      res.status(200).json({
        success: true,
        data: analytics,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt((req.query.page as string) || '1', 10);
      const limit = parseInt((req.query.limit as string) || '10', 10);
      const search = req.query.search as string | undefined;

      const result = await AdminService.getUsers(page, limit, search);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateUserRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { role } = req.body;
      const user = await AdminService.updateUserRole(req.params.id as string, role, req.user!.id);
      res.status(200).json({
        success: true,
        message: `User role updated to ${role}`,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await AdminService.deleteUser(req.params.id as string, req.user!.id);
      res.status(200).json({
        success: true,
        message: 'User account removed successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
