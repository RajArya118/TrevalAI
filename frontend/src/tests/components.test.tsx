import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { DestinationCard } from '../components/destination/DestinationCard';
import { HotelCard } from '../components/hotel/HotelCard';
import { EmptyState } from '../components/common/EmptyState';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';
import { Compass } from 'lucide-react';

const mockDestination = {
  id: 'dest-1',
  name: 'Goa Coastal Paradise',
  city: 'Goa',
  country: 'India',
  category: 'Beach',
  description: 'Sunny beaches and vibrant culture.',
  imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2',
  rating: 4.8,
  estimatedBudget: 18000,
  bestTimeToVisit: 'Nov to Feb',
  attractions: ['Baga Beach', 'Fort Aguada'],
  featured: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockHotel = {
  id: 'hotel-1',
  name: 'The Leela Goa Luxury Beach Resort',
  destinationId: 'dest-1',
  pricePerNight: 12500,
  rating: 4.9,
  address: 'Mobor Beach, Goa',
  imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
  amenities: ['Private Beach', 'Infinity Pool', 'Free Breakfast'],
  featured: true,
  createdAt: new Date().toISOString(),
  destination: {
    id: 'dest-1',
    name: 'Goa Coastal Paradise',
    city: 'Goa',
    country: 'India',
  },
};

describe('Frontend Component Tests', () => {
  it('renders DestinationCard with title, category, budget and rating', () => {
    render(
      <BrowserRouter>
        <ToastProvider>
          <AuthProvider>
            <DestinationCard destination={mockDestination} />
          </AuthProvider>
        </ToastProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Goa Coastal Paradise')).toBeInTheDocument();
    expect(screen.getByText('Beach')).toBeInTheDocument();
    expect(screen.getByText('4.8')).toBeInTheDocument();
    expect(screen.getByText(/18,000/)).toBeInTheDocument();
  });

  it('renders HotelCard with price per night, rating, and amenities', () => {
    render(
      <BrowserRouter>
        <HotelCard hotel={mockHotel} />
      </BrowserRouter>
    );

    expect(screen.getByText('The Leela Goa Luxury Beach Resort')).toBeInTheDocument();
    expect(screen.getByText('4.9')).toBeInTheDocument();
    expect(screen.getByText(/12,500/)).toBeInTheDocument();
    expect(screen.getByText('Private Beach')).toBeInTheDocument();
  });

  it('renders EmptyState with icon, title, and action', () => {
    render(
      <BrowserRouter>
        <EmptyState
          icon={Compass}
          title="No Trips Found"
          description="You have not created any trips yet."
          actionText="Plan Trip"
          actionLink="/ai-planner"
        />
      </BrowserRouter>
    );

    expect(screen.getByText('No Trips Found')).toBeInTheDocument();
    expect(screen.getByText('You have not created any trips yet.')).toBeInTheDocument();
    expect(screen.getByText('Plan Trip')).toBeInTheDocument();
  });
});
