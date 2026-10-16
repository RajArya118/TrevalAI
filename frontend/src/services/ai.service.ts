import { api } from './api';
import { AiItineraryResponse } from '../types';

export interface PlanTripAiPayload {
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: number;
  tripStyle: string;
  preferences?: string;
}

export const aiService = {
  async planTrip(payload: PlanTripAiPayload): Promise<AiItineraryResponse> {
    const res = await api.post('/ai/plan-trip', payload);
    return res.data.data;
  },
};
