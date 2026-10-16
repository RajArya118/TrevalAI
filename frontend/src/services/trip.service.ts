import { api } from './api';
import { Trip, Pagination } from '../types';

export const tripService = {
  async getUserTrips(): Promise<Trip[]> {
    const res = await api.get('/trips');
    return res.data.data.trips;
  },

  async getById(id: string): Promise<Trip> {
    const res = await api.get(`/trips/${id}`);
    return res.data.data.trip;
  },

  async create(data: Partial<Trip>): Promise<Trip> {
    const res = await api.post('/trips', data);
    return res.data.data.trip;
  },

  async update(id: string, data: Partial<Trip>): Promise<Trip> {
    const res = await api.put(`/trips/${id}`, data);
    return res.data.data.trip;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/trips/${id}`);
  },

  async getAllForAdmin(page = 1, limit = 10): Promise<{ trips: Trip[]; pagination: Pagination }> {
    const res = await api.get('/trips/admin/all', { params: { page, limit } });
    return res.data.data;
  },
};
