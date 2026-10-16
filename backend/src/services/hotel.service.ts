import { prisma } from '../config/prisma.js';
import { NotFoundError } from '../utils/errors.js';
import { CreateHotelInput, UpdateHotelInput, HotelQueryInput } from '../validators/hotel.validator.js';

export class HotelService {
  static async getAll(query: HotelQueryInput) {
    const { destinationId, search, minPrice, maxPrice, minRating, featured, page = 1, limit = 12 } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (destinationId) {
      where.destinationId = destinationId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { destination: { name: { contains: search, mode: 'insensitive' } } },
        { destination: { city: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (featured !== undefined) {
      where.featured = featured === 'true';
    }

    if (minRating !== undefined) {
      where.rating = { gte: minRating };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.pricePerNight = {};
      if (minPrice !== undefined) where.pricePerNight.gte = minPrice;
      if (maxPrice !== undefined) where.pricePerNight.lte = maxPrice;
    }

    const [total, hotels] = await Promise.all([
      prisma.hotel.count({ where }),
      prisma.hotel.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ featured: 'desc' }, { rating: 'desc' }],
        include: {
          destination: {
            select: { id: true, name: true, city: true, country: true },
          },
          _count: {
            select: { reviews: true },
          },
        },
      }),
    ]);

    return {
      hotels,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getFeatured(limit = 6) {
    return prisma.hotel.findMany({
      where: { featured: true },
      take: limit,
      orderBy: { rating: 'desc' },
      include: {
        destination: {
          select: { id: true, name: true, city: true, country: true },
        },
      },
    });
  }

  static async getById(id: string) {
    const hotel = await prisma.hotel.findUnique({
      where: { id },
      include: {
        destination: true,
        reviews: {
          include: {
            user: {
              select: { id: true, name: true, avatar: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!hotel) {
      throw new NotFoundError(`Hotel with ID '${id}' was not found.`);
    }

    return hotel;
  }

  static async create(data: CreateHotelInput) {
    // Validate destination exists
    const dest = await prisma.destination.findUnique({ where: { id: data.destinationId } });
    if (!dest) {
      throw new NotFoundError(`Destination with ID '${data.destinationId}' does not exist.`);
    }

    return prisma.hotel.create({
      data,
      include: {
        destination: { select: { id: true, name: true, city: true, country: true } },
      },
    });
  }

  static async update(id: string, data: UpdateHotelInput) {
    const existing = await prisma.hotel.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError(`Hotel with ID '${id}' not found.`);
    }

    if (data.destinationId) {
      const dest = await prisma.destination.findUnique({ where: { id: data.destinationId } });
      if (!dest) {
        throw new NotFoundError(`Destination with ID '${data.destinationId}' does not exist.`);
      }
    }

    return prisma.hotel.update({
      where: { id },
      data,
      include: {
        destination: { select: { id: true, name: true, city: true, country: true } },
      },
    });
  }

  static async delete(id: string) {
    const existing = await prisma.hotel.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError(`Hotel with ID '${id}' not found.`);
    }

    return prisma.hotel.delete({ where: { id } });
  }
}
