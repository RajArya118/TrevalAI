import { z } from 'zod';

export const createHotelSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  destinationId: z.string().uuid('Valid destination ID is required'),
  pricePerNight: z.number().positive('Price per night must be positive'),
  rating: z.number().min(0).max(5).default(4.0),
  address: z.string().min(5, 'Address is required'),
  imageUrl: z.string().url('Must provide a valid image URL'),
  amenities: z.array(z.string()).min(1, 'At least one amenity is required'),
  featured: z.boolean().default(false),
});

export const updateHotelSchema = createHotelSchema.partial();

export const hotelQuerySchema = z.object({
  destinationId: z.string().optional(),
  search: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  minRating: z.coerce.number().optional(),
  featured: z.enum(['true', 'false']).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(12),
});

export type CreateHotelInput = z.infer<typeof createHotelSchema>;
export type UpdateHotelInput = z.infer<typeof updateHotelSchema>;
export type HotelQueryInput = z.infer<typeof hotelQuerySchema>;
