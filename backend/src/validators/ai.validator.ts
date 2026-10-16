import { z } from 'zod';

export const planTripAiSchema = z.object({
  destination: z.string().min(2, 'Destination name is required'),
  startDate: z.string().min(4, 'Start date is required'),
  endDate: z.string().min(4, 'End date is required'),
  travelers: z.number().int().min(1, 'At least 1 traveler is required').default(1),
  budget: z.number().positive('Budget in INR must be greater than 0'),
  tripStyle: z.enum(['adventure', 'relaxation', 'culture', 'family', 'food', 'romantic', 'nature']),
  preferences: z.string().optional().default(''),
});

export type PlanTripAiInput = z.infer<typeof planTripAiSchema>;
