import { api } from './api';
import { Destination, Pagination } from '../types';

export interface DestinationFilterParams {
  search?: string;
  category?: string;
  minBudget?: number;
  maxBudget?: number;
  featured?: 'true' | 'false';
  page?: number;
  limit?: number;
}

export const destinationService = {
  async getAll(params?: DestinationFilterParams): Promise<{ destinations: Destination[]; pagination: Pagination }> {
    const res = await api.get('/destinations', { params });
    return res.data.data;
  },

  async getFeatured(limit = 6): Promise<Destination[]> {
    const res = await api.get('/destinations/featured', { params: { limit } });
    return res.data.data.destinations;
  },

  async getCategories(): Promise<Array<{ category: string; count: number }>> {
    const res = await api.get('/destinations/categories');
    return res.data.data.categories;
  },

  async getById(id: string): Promise<Destination> {
    const res = await api.get(`/destinations/${id}`);
    return res.data.data.destination;
  },

  async create(data: Partial<Destination>): Promise<Destination> {
    const res = await api.post('/destinations', data);
    return res.data.data.destination;
  },

  async update(id: string, data: Partial<Destination>): Promise<Destination> {
    const res = await api.put(`/destinations/${id}`, data);
    return res.data.data.destination;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/destinations/${id}`);
  },

  async toggleSaved(destinationId: string): Promise<{ isSaved: boolean; message: string }> {
    const res = await api.post('/saved/toggle', { destinationId });
    return res.data.data;
  },

  async getSaved(): Promise<Destination[]> {
    const res = await api.get('/saved');
    return res.data.data.saved;
  },
};
