import { prisma } from '../config/prisma.js';
import { NotFoundError } from '../utils/errors.js';
import {
  CreateDestinationInput,
  UpdateDestinationInput,
  DestinationQueryInput,
} from '../validators/destination.validator.js';

export class DestinationService {
  static async getAll(query: DestinationQueryInput, currentUserId?: string) {
    const { search, category, minBudget, maxBudget, featured, page = 1, limit = 12 } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { country: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category && category !== 'All') {
      where.category = { equals: category, mode: 'insensitive' };
    }

    if (featured !== undefined) {
      where.featured = featured === 'true';
    }

    if (minBudget !== undefined || maxBudget !== undefined) {
      where.estimatedBudget = {};
      if (minBudget !== undefined) where.estimatedBudget.gte = minBudget;
      if (maxBudget !== undefined) where.estimatedBudget.lte = maxBudget;
    }

    const [total, items] = await Promise.all([
      prisma.destination.count({ where }),
      prisma.destination.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ featured: 'desc' }, { rating: 'desc' }],
        include: {
          _count: {
            select: { hotels: true, reviews: true, savedBy: true },
          },
          ...(currentUserId
            ? {
                savedBy: {
                  where: { userId: currentUserId },
                  select: { id: true },
                },
              }
            : {}),
        },
      }),
    ]);

    const formattedItems = items.map((item: any) => ({
      ...item,
      isSaved: currentUserId ? item.savedBy?.length > 0 : false,
      savedBy: undefined,
    }));

    return {
      destinations: formattedItems,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getFeatured(limit = 6) {
    return prisma.destination.findMany({
      where: { featured: true },
      take: limit,
      orderBy: { rating: 'desc' },
      include: {
        _count: { select: { hotels: true, reviews: true } },
      },
    });
  }

  static async getById(id: string, currentUserId?: string) {
    const destination = await prisma.destination.findUnique({
      where: { id },
      include: {
        hotels: {
          take: 6,
          orderBy: { rating: 'desc' },
        },
        reviews: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: { id: true, name: true, avatar: true },
            },
          },
        },
        _count: {
          select: { hotels: true, reviews: true, savedBy: true },
        },
        ...(currentUserId
          ? {
              savedBy: {
                where: { userId: currentUserId },
                select: { id: true },
              },
            }
          : {}),
      },
    });

    if (!destination) {
      throw new NotFoundError(`Destination with ID '${id}' was not found.`);
    }

    return {
      ...destination,
      isSaved: currentUserId ? (destination as any).savedBy?.length > 0 : false,
      savedBy: undefined,
    };
  }

  static async create(data: CreateDestinationInput) {
    return prisma.destination.create({
      data,
    });
  }

  static async update(id: string, data: UpdateDestinationInput) {
    const existing = await prisma.destination.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError(`Destination with ID '${id}' not found.`);
    }

    return prisma.destination.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    const existing = await prisma.destination.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError(`Destination with ID '${id}' not found.`);
    }

    return prisma.destination.delete({
      where: { id },
    });
  }

  static async getCategories() {
    const destinations = await prisma.destination.groupBy({
      by: ['category'],
      _count: { _all: true },
    });

    return destinations.map((d) => ({
      category: d.category,
      count: d._count._all,
    }));
  }
}
