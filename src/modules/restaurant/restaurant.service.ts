import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RestaurantService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll(country?: string) {
    const where = {
      isActive: true,
      ...(country && { country }),
    };

    return this.prisma.restaurant.findMany({
      where,
      orderBy: { rating: 'desc' },
    });
  }

  async findById(id: string) {
    return this.prisma.restaurant.findUnique({
      where: { id },
    });
  }

  async findMenuByRestaurantId(restaurantId: string, country: string) {
    // Verify restaurant belongs to user's country
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant || restaurant.country !== country) {
      throw new Error('Restaurant not found or not available in your country');
    }

    return this.prisma.menuItem.findMany({
      where: {
        restaurantId,
        isAvailable: true,
      },
      include: {
        restaurant: true,
      },
      orderBy: { category: 'asc' },
    });
  }

  async findMenuItems(country?: string) {
    const where = {
      isAvailable: true,
      restaurant: {
        isActive: true,
        ...(country && { country }),
      },
    };

    return this.prisma.menuItem.findMany({
      where,
      include: {
        restaurant: true,
      },
      orderBy: { name: 'asc' },
    });
  }
}
