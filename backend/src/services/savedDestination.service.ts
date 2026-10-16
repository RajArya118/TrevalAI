import { prisma } from '../config/prisma.js';
import { NotFoundError } from '../utils/errors.js';

export class SavedDestinationService {
  static async getUserSaved(userId: string) {
    const saved = await prisma.savedDestination.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        destination: {
          include: {
            _count: { select: { hotels: true, reviews: true } },
          },
        },
      },
    });

    return saved.map((s) => ({
      ...s.destination,
      savedAt: s.createdAt,
      isSaved: true,
    }));
  }

  static async toggle(userId: string, destinationId: string) {
    const destination = await prisma.destination.findUnique({ where: { id: destinationId } });
    if (!destination) {
      throw new NotFoundError(`Destination with ID '${destinationId}' not found.`);
    }

    const existing = await prisma.savedDestination.findUnique({
      where: {
        userId_destinationId: {
          userId,
          destinationId,
        },
      },
    });

    if (existing) {
      await prisma.savedDestination.delete({
        where: { id: existing.id },
      });
      return { isSaved: false, message: 'Removed from saved destinations' };
    } else {
      await prisma.savedDestination.create({
        data: { userId, destinationId },
      });
      return { isSaved: true, message: 'Added to saved destinations' };
    }
  }
}
