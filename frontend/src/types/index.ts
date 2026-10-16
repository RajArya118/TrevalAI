export type Role = 'USER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  createdAt: string;
  _count?: {
    trips: number;
    savedDestinations: number;
    reviews: number;
  };
}

export interface Destination {
  id: string;
  name: string;
  city: string;
  country: string;
  category: string;
  description: string;
  imageUrl: string;
  rating: number;
  estimatedBudget: number;
  bestTimeToVisit: string;
  attractions: string[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  isSaved?: boolean;
  _count?: {
    hotels: number;
    reviews: number;
    savedBy: number;
  };
}

export interface Hotel {
  id: string;
  name: string;
  destinationId: string;
  pricePerNight: number;
  rating: number;
  address: string;
  imageUrl: string;
  amenities: string[];
  featured: boolean;
  createdAt: string;
  destination?: {
    id: string;
    name: string;
    city: string;
    country: string;
  };
  _count?: {
    reviews: number;
  };
}

export interface DayItinerary {
  day: number;
  title: string;
  theme: string;
  morning: {
    activity: string;
    description: string;
    estimatedCostInr: number;
    location: string;
  };
  afternoon: {
    activity: string;
    description: string;
    estimatedCostInr: number;
    location: string;
  };
  evening: {
    activity: string;
    description: string;
    estimatedCostInr: number;
    location: string;
  };
  meals: {
    breakfast: string;
    lunch: string;
    dinner: string;
    estimatedTotalCostInr: number;
  };
  dailyTotalCostInr: number;
}

export interface AiItineraryResponse {
  isDemo: boolean;
  demoReason?: string;
  modelUsed?: string;
  disclaimer: string;
  tripSummary: {
    destination: string;
    durationDays: number;
    totalEstimatedBudgetInr: number;
    tripStyle: string;
    travelers: number;
    overview: string;
  };
  days: DayItinerary[];
  budgetBreakdown: {
    accommodationInr: number;
    activitiesInr: number;
    foodInr: number;
    localTransportInr: number;
    contingencyInr: number;
    grandTotalInr: number;
  };
  travelTips: string[];
  suggestedHotelsFromDb: Array<{
    id: string;
    name: string;
    pricePerNight: number;
    rating: number;
    address: string;
    imageUrl: string;
    amenities: string[];
  }>;
}

export interface Trip {
  id: string;
  userId: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: number;
  tripStyle: string;
  preferences?: string;
  itinerary: any;
  status: 'PLANNED' | 'COMPLETED' | 'CANCELLED';
  isAiGenerated: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    name: string;
    email: string;
  };
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminAnalytics {
  overview: {
    totalUsers: number;
    totalDestinations: number;
    totalHotels: number;
    totalTrips: number;
  };
  charts: {
    destinationsByCategory: Array<{ name: string; count: number }>;
    tripsByStyle: Array<{ style: string; count: number }>;
    monthlyTripsTrend: Array<{ month: string; trips: number; totalBudget: number }>;
  };
  topDestinations: Array<{
    id: string;
    name: string;
    city: string;
    country: string;
    rating: number;
  }>;
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
    role: Role;
    createdAt: string;
  }>;
  recentTrips: Array<{
    id: string;
    title: string;
    destination: string;
    budget: number;
    createdAt: string;
    user?: { name: string; email: string };
  }>;
}
