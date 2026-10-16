import { z } from 'zod';

export const createDestinationSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  city: z.string().min(2, 'City is required'),
  country: z.string().min(2, 'Country is required'),
  category: z.string().min(2, 'Category is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  imageUrl: z.string().url('Must provide a valid image URL'),
  rating: z.number().min(0).max(5).default(4.5),
  estimatedBudget: z.number().positive('Estimated budget must be positive'),
  bestTimeToVisit: z.string().min(2, 'Best time to visit is required'),
  attractions: z.array(z.string()).min(1, 'At least one attraction is required'),
  featured: z.boolean().default(false),
});

export const updateDestinationSchema = createDestinationSchema.partial();

export const destinationQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  minBudget: z.coerce.number().optional(),
  maxBudget: z.coerce.number().optional(),
  featured: z.enum(['true', 'false']).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(12),
});

export type CreateDestinationInput = z.infer<typeof createDestinationSchema>;
export type UpdateDestinationInput = z.infer<typeof updateDestinationSchema>;
export type DestinationQueryInput = z.infer<typeof destinationQuerySchema>;
