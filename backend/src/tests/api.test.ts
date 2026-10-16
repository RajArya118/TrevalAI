import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import { prisma } from '../config/prisma.js';

describe('TravelAI Backend API Integration Tests', () => {
  let userToken: string;
  let adminToken: string;
  let userId: string;
  let adminId: string;
  let testDestinationId: string;
  let testHotelId: string;
  let testTripId: string;

  beforeAll(async () => {
    // Connect to database
    await prisma.$connect();
  });

  afterAll(async () => {
    // Cleanup any test specific entities
    if (testTripId) {
      await prisma.trip.deleteMany({ where: { id: testTripId } });
    }
    if (testHotelId) {
      await prisma.hotel.deleteMany({ where: { id: testHotelId } });
    }
    if (testDestinationId) {
      await prisma.destination.deleteMany({ where: { id: testDestinationId } });
    }
    await prisma.$disconnect();
  });

  // 1. Health check
  describe('GET /api/health', () => {
    it('should return 200 and healthy status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('healthy');
      expect(res.body.services.database).toBe('ok');
    });
  });

  // 2. Authentication & Authorization
  describe('Authentication Endpoints', () => {
    const testEmail = `testuser_${Date.now()}@travelai.com`;

    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Integration Test User',
          email: testEmail,
          password: 'Password123!',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(testEmail);
      expect(res.body.data.token).toBeDefined();
      userToken = res.body.data.token;
      userId = res.body.data.user.id;
    });

    it('should reject registration with duplicate email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Duplicate User',
          email: testEmail,
          password: 'Password123!',
        });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it('should reject login with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: 'WrongPassword!',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should login admin with seeded credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@travelai.com',
          password: 'Admin@TravelAI2026',
        });

      expect(res.status).toBe(200);
      expect(res.body.data.user.role).toBe('ADMIN');
      adminToken = res.body.data.token;
      adminId = res.body.data.user.id;
    });

    it('should return profile for authenticated user via /api/auth/me', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.user.email).toBe(testEmail);
    });

    it('should reject /api/auth/me without token', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
    });
  });

  // 3. Destinations CRUD & Authorization
  describe('Destinations Endpoints', () => {
    it('should list public destinations', async () => {
      const res = await request(app).get('/api/destinations');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data.destinations)).toBe(true);
      expect(res.body.data.destinations.length).toBeGreaterThan(0);
    });

    it('should reject creating destination by ordinary user (requireAdmin)', async () => {
      const res = await request(app)
        .post('/api/destinations')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Unauthorized Spot',
          city: 'Test City',
          country: 'Test Country',
          category: 'Beach',
          description: 'A test spot that should be rejected by admin middleware.',
          imageUrl: 'https://example.com/test.jpg',
          rating: 4.5,
          estimatedBudget: 15000,
          bestTimeToVisit: 'All year',
          attractions: ['Sight 1'],
        });

      expect(res.status).toBe(403);
    });

    it('should allow admin to create a destination', async () => {
      const res = await request(app)
        .post('/api/destinations')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Zermatt Matterhorn Peak',
          city: 'Zermatt',
          country: 'Switzerland',
          category: 'Mountain',
          description: 'Car-free mountain resort known for skiing and views of the iconic Matterhorn peak.',
          imageUrl: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=1000',
          rating: 4.9,
          estimatedBudget: 90000,
          bestTimeToVisit: 'December to April',
          attractions: ['Gornergrat Railway', 'Matterhorn Glacier Paradise', 'Rothorn'],
          featured: true,
        });

      expect(res.status).toBe(201);
      expect(res.body.data.destination.name).toBe('Zermatt Matterhorn Peak');
      testDestinationId = res.body.data.destination.id;
    });

    it('should get destination by ID', async () => {
      const res = await request(app).get(`/api/destinations/${testDestinationId}`);
      expect(res.status).toBe(200);
      expect(res.body.data.destination.id).toBe(testDestinationId);
    });
  });

  // 4. Hotels CRUD & Authorization
  describe('Hotels Endpoints', () => {
    it('should allow admin to create a hotel under a destination', async () => {
      const res = await request(app)
        .post('/api/hotels')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Matterhorn Alpine Lodge',
          destinationId: testDestinationId,
          pricePerNight: 28000,
          rating: 4.8,
          address: 'Bahnhofstrasse 12, Zermatt',
          imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1000',
          amenities: ['Matterhorn View', 'Indoor Spa', 'Free Breakfast', 'Ski Shuttle'],
          featured: true,
        });

      expect(res.status).toBe(201);
      expect(res.body.data.hotel.name).toBe('Matterhorn Alpine Lodge');
      testHotelId = res.body.data.hotel.id;
    });

    it('should reject hotel creation by regular user', async () => {
      const res = await request(app)
        .post('/api/hotels')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Unauthorized Hotel',
          destinationId: testDestinationId,
          pricePerNight: 5000,
          rating: 4.0,
          address: 'Test Street',
          imageUrl: 'https://example.com/hotel.jpg',
          amenities: ['WiFi'],
        });

      expect(res.status).toBe(403);
    });
  });

  // 5. Trip CRUD & User Ownership Enforcement
  describe('Trip Endpoints & Ownership', () => {
    it('should allow user to save a trip itinerary', async () => {
      const res = await request(app)
        .post('/api/trips')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: 'My Dream Vacation to Switzerland',
          destination: 'Zermatt, Switzerland',
          startDate: '2026-12-01',
          endDate: '2026-12-06',
          travelers: 2,
          budget: 150000,
          tripStyle: 'adventure',
          preferences: 'Skiing and mountain photography',
          itinerary: { days: [{ day: 1, title: 'Arrival in Zermatt' }] },
          status: 'PLANNED',
          isAiGenerated: true,
        });

      expect(res.status).toBe(201);
      expect(res.body.data.trip.title).toBe('My Dream Vacation to Switzerland');
      testTripId = res.body.data.trip.id;
    });

    it('should list user saved trips', async () => {
      const res = await request(app)
        .get('/api/trips')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.trips.some((t: any) => t.id === testTripId)).toBe(true);
    });

    it('should prevent another user from accessing private trip (ownership check)', async () => {
      // Create another user
      const otherUser = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Other Traveler',
          email: `other_${Date.now()}@travelai.com`,
          password: 'Password123!',
        });
      const otherToken = otherUser.body.data.token;

      // Attempt to access user 1's trip
      const res = await request(app)
        .get(`/api/trips/${testTripId}`)
        .set('Authorization', `Bearer ${otherToken}`);

      expect(res.status).toBe(403);
    });

    it('should allow admin to access any trip itinerary', async () => {
      const res = await request(app)
        .get(`/api/trips/${testTripId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.trip.id).toBe(testTripId);
    });
  });

  // 6. AI Trip Planner Engine & Demo Fallback
  describe('AI Trip Planner Endpoint (/api/ai/plan-trip)', () => {
    it('should generate an itinerary with day-by-day schedule and INR cost breakdown', async () => {
      const res = await request(app)
        .post('/api/ai/plan-trip')
        .send({
          destination: 'Goa',
          startDate: '2026-11-20',
          endDate: '2026-11-23',
          travelers: 2,
          budget: 35000,
          tripStyle: 'relaxation',
          preferences: 'Beach relaxation and seafood',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.tripSummary.destination).toBe('Goa');
      expect(res.body.data.tripSummary.totalEstimatedBudgetInr).toBe(35000);
      expect(Array.isArray(res.body.data.days)).toBe(true);
      expect(res.body.data.days.length).toBeGreaterThan(0);
      expect(res.body.data.budgetBreakdown.grandTotalInr).toBe(35000);
      expect(res.body.data.isDemo).toBeDefined();
      expect(res.body.data.disclaimer).toBeDefined();
    });

    it('should reject invalid trip parameters with 400 validation error', async () => {
      const res = await request(app)
        .post('/api/ai/plan-trip')
        .send({
          destination: '', // Invalid empty destination
          startDate: '2026-11-20',
          endDate: '2026-11-23',
          travelers: 0, // Invalid travelers
          budget: -500, // Invalid budget
          tripStyle: 'invalid-style',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });
  });

  // 7. Admin Analytics & User Management
  describe('Admin Analytics & Management', () => {
    it('should reject regular user from accessing /api/admin/analytics', async () => {
      const res = await request(app)
        .get('/api/admin/analytics')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(403);
    });

    it('should return complete DB-backed analytics for admin', async () => {
      const res = await request(app)
        .get('/api/admin/analytics')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.overview.totalDestinations).toBeGreaterThan(0);
      expect(res.body.data.overview.totalUsers).toBeGreaterThan(0);
      expect(res.body.data.charts.monthlyTripsTrend).toBeDefined();
      expect(res.body.data.charts.destinationsByCategory).toBeDefined();
    });
  });
});
