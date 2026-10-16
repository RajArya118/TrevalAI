import { prisma } from '../config/prisma.js';
import { NotFoundError, ForbiddenError } from '../utils/errors.js';
import { CreateTripInput, UpdateTripInput } from '../validators/trip.validator.js';

export class TripService {
  static async getUserTrips(userId: string) {
    return prisma.trip.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getById(tripId: string, userId: string, userRole: string = 'USER') {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    if (!trip) {
      throw new NotFoundError(`Trip with ID '${tripId}' not found.`);
    }

    if (trip.userId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenError('You do not have permission to view this trip itinerary.');
    }

    return trip;
  }

  static async create(userId: string, data: CreateTripInput) {
    return prisma.trip.create({
      data: {
        userId,
        title: data.title,
        destination: data.destination,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        travelers: data.travelers,
        budget: data.budget,
        tripStyle: data.tripStyle,
        preferences: data.preferences,
        itinerary: data.itinerary ?? {},
        status: data.status,
        isAiGenerated: data.isAiGenerated,
      },
    });
  }

  static async update(tripId: string, userId: string, data: UpdateTripInput, userRole: string = 'USER') {
    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) {
      throw new NotFoundError(`Trip with ID '${tripId}' not found.`);
    }

    if (trip.userId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenError('You do not have permission to modify this trip.');
    }

    const updatePayload: any = { ...data };
    if (data.startDate) updatePayload.startDate = new Date(data.startDate);
    if (data.endDate) updatePayload.endDate = new Date(data.endDate);

    return prisma.trip.update({
      where: { id: tripId },
      data: updatePayload,
    });
  }

  static async delete(tripId: string, userId: string, userRole: string = 'USER') {
    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) {
      throw new NotFoundError(`Trip with ID '${tripId}' not found.`);
    }

    if (trip.userId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenError('You do not have permission to delete this trip.');
    }

    return prisma.trip.delete({
      where: { id: tripId },
    });
  }

  static async getAllForAdmin(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [total, trips] = await Promise.all([
      prisma.trip.count(),
      prisma.trip.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      }),
    ]);

    return {
      trips,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
