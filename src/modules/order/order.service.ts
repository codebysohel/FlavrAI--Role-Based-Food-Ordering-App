import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderInput, UpdateOrderStatusInput } from './types/order.type';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, userCountry: string, input: CreateOrderInput) {
    // Verify restaurant exists and belongs to user's country
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: input.restaurantId },
    });

    if (!restaurant || restaurant.country !== userCountry) {
      throw new ForbiddenException('Restaurant not found or not available in your country');
    }

    // Calculate total and validate menu items
    let totalAmount = 0;
    const orderItems = [];

    for (const item of input.items) {
      const menuItem = await this.prisma.menuItem.findUnique({
        where: { id: item.menuItemId },
      });

      if (!menuItem || !menuItem.isAvailable) {
        throw new NotFoundException(`Menu item ${item.menuItemId} not found or unavailable`);
      }

      if (menuItem.restaurantId !== input.restaurantId) {
        throw new ForbiddenException(`Menu item ${menuItem.name} does not belong to this restaurant`);
      }

      const totalPrice = menuItem.price * item.quantity;
      totalAmount += totalPrice;

      orderItems.push({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        unitPrice: menuItem.price,
        totalPrice,
      });
    }

    // Create order with items
    const order = await this.prisma.order.create({
      data: {
        userId,
        restaurantId: input.restaurantId,
        country: userCountry,
        totalAmount,
        notes: input.notes,
        status: 'PENDING',
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
        restaurant: true,
      },
    });

    return order;
  }

  async findByUserId(userId: string, userCountry: string) {
    return this.prisma.order.findMany({
      where: {
        userId,
        country: userCountry,
      },
      include: {
        items: true,
        restaurant: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(orderId: string, userCountry: string, userRole: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        restaurant: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Users can only see orders from their country
    if (order.country !== userCountry && userRole !== 'ADMIN') {
      throw new ForbiddenException('Access denied. Order belongs to a different country');
    }

    return order;
  }

  async findAllByCountry(country: string) {
    return this.prisma.order.findMany({
      where: { country },
      include: {
        items: true,
        restaurant: true,
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(
    orderId: string,
    userCountry: string,
    userRole: string,
    input: UpdateOrderStatusInput,
  ) {
    // Only Admin and Manager can update order status
    if (!['ADMIN', 'MANAGER'].includes(userRole)) {
      throw new ForbiddenException('Only Admin and Manager can update order status');
    }

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Verify order belongs to user's country
    if (order.country !== userCountry) {
      throw new ForbiddenException('Access denied. Order belongs to a different country');
    }

    // Update order status
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: input.status as any },
      include: {
        items: true,
        restaurant: true,
      },
    });
  }

  async cancelOrder(orderId: string, userId: string, userCountry: string, userRole: string) {
    // Only Admin and Manager can cancel orders
    if (!['ADMIN', 'MANAGER'].includes(userRole)) {
      throw new ForbiddenException('Only Admin and Manager can cancel orders');
    }

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Verify order belongs to user's country
    if (order.country !== userCountry) {
      throw new ForbiddenException('Access denied. Order belongs to a different country');
    }

    // Only cancel if order is in PENDING or CONFIRMED status
    if (!['PENDING', 'CONFIRMED'].includes(order.status)) {
      throw new ForbiddenException('Can only cancel orders that are PENDING or CONFIRMED');
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
      include: {
        items: true,
        restaurant: true,
      },
    });
  }
}
