import { z } from 'zod';

export const createTripSchema = z.object({
  title: z.string().min(2, 'Trip title is required'),
  destination: z.string().min(2, 'Destination is required'),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),
  travelers: z.number().int().min(1, 'At least 1 traveler is required').default(1),
  budget: z.number().positive('Budget must be positive'),
  tripStyle: z.string().min(2, 'Trip style is required'),
  preferences: z.string().optional(),
  itinerary: z.any(), // JSON structure
  status: z.enum(['PLANNED', 'COMPLETED', 'CANCELLED']).default('PLANNED'),
  isAiGenerated: z.boolean().default(true),
});

export const updateTripSchema = createTripSchema.partial();

export type CreateTripInput = z.infer<typeof createTripSchema>;
export type UpdateTripInput = z.infer<typeof updateTripSchema>;
