import { prisma } from '../config/prisma.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';

export class AdminService {
  static async getAnalytics() {
    const [totalUsers, totalDestinations, totalHotels, totalTrips] = await Promise.all([
      prisma.user.count(),
      prisma.destination.count(),
      prisma.hotel.count(),
      prisma.trip.count(),
    ]);

    // Destination category distribution
    const destinationsByCategory = await prisma.destination.groupBy({
      by: ['category'],
      _count: { _all: true },
    });

    // Trips by style
    const tripsByStyle = await prisma.trip.groupBy({
      by: ['tripStyle'],
      _count: { _all: true },
    });

    // Top rated destinations
    const topDestinations = await prisma.destination.findMany({
      take: 5,
      orderBy: { rating: 'desc' },
      select: { id: true, name: true, city: true, country: true, rating: true },
    });

    // Recent registered users
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    // Recent created trips
    const recentTrips = await prisma.trip.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    // Monthly trips chart data (simulated grouping based on trips in DB)
    const allTrips = await prisma.trip.findMany({
      select: { createdAt: true, budget: true },
      orderBy: { createdAt: 'asc' },
    });

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyMap = new Map<string, { month: string; trips: number; totalBudget: number }>();

    // Seed past 6 months if sparse
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      monthlyMap.set(key, { month: monthNames[d.getMonth()], trips: 0, totalBudget: 0 });
    }

    allTrips.forEach((trip) => {
      const d = new Date(trip.createdAt);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      const existing = monthlyMap.get(key);
      if (existing) {
        existing.trips += 1;
        existing.totalBudget += trip.budget;
      } else {
        monthlyMap.set(key, { month: monthNames[d.getMonth()], trips: 1, totalBudget: trip.budget });
      }
    });

    const monthlyTripsTrend = Array.from(monthlyMap.values());

    return {
      overview: {
        totalUsers,
        totalDestinations,
        totalHotels,
        totalTrips,
      },
      charts: {
        destinationsByCategory: destinationsByCategory.map((d) => ({
          name: d.category,
          count: d._count._all,
        })),
        tripsByStyle: tripsByStyle.map((t) => ({
          style: t.tripStyle,
          count: t._count._all,
        })),
        monthlyTripsTrend,
      },
      topDestinations,
      recentUsers,
      recentTrips,
    };
  }

  static async getUsers(page = 1, limit = 10, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatar: true,
          createdAt: true,
          _count: {
            select: { trips: true, savedDestinations: true },
          },
        },
      }),
    ]);

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async updateUserRole(userId: string, role: 'USER' | 'ADMIN', currentAdminId: string) {
    if (userId === currentAdminId && role !== 'ADMIN') {
      throw new BadRequestError('You cannot revoke your own administrator role.');
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError('User not found.');
    }

    return prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });
  }

  static async deleteUser(userId: string, currentAdminId: string) {
    if (userId === currentAdminId) {
      throw new BadRequestError('You cannot delete your own administrator account.');
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError('User not found.');
    }

    return prisma.user.delete({
      where: { id: userId },
    });
  }
}
