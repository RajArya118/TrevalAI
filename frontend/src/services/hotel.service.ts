import { api } from './api';
import { Hotel, Pagination } from '../types';

export interface HotelFilterParams {
  destinationId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  featured?: 'true' | 'false';
  page?: number;
  limit?: number;
}

export const hotelService = {
  async getAll(params?: HotelFilterParams): Promise<{ hotels: Hotel[]; pagination: Pagination }> {
    const res = await api.get('/hotels', { params });
    return res.data.data;
  },

  async getFeatured(limit = 6): Promise<Hotel[]> {
    const res = await api.get('/hotels/featured', { params: { limit } });
    return res.data.data.hotels;
  },

  async getById(id: string): Promise<Hotel> {
    const res = await api.get(`/hotels/${id}`);
    return res.data.data.hotel;
  },

  async create(data: Partial<Hotel>): Promise<Hotel> {
    const res = await api.post('/hotels', data);
    return res.data.data.hotel;
  },

  async update(id: string, data: Partial<Hotel>): Promise<Hotel> {
    const res = await api.put(`/hotels/${id}`, data);
    return res.data.data.hotel;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/hotels/${id}`);
  },
};
