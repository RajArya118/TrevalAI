import { api } from './api';
import { AdminAnalytics, User, Pagination } from '../types';

export const adminService = {
  async getAnalytics(): Promise<AdminAnalytics> {
    const res = await api.get('/admin/analytics');
    return res.data.data;
  },

  async getUsers(page = 1, limit = 10, search?: string): Promise<{ users: User[]; pagination: Pagination }> {
    const res = await api.get('/admin/users', { params: { page, limit, search } });
    return res.data.data;
  },

  async updateUserRole(userId: string, role: 'USER' | 'ADMIN'): Promise<{ user: User }> {
    const res = await api.put(`/admin/users/${userId}/role`, { role });
    return res.data.data;
  },

  async deleteUser(userId: string): Promise<void> {
    await api.delete(`/admin/users/${userId}`);
  },
};
