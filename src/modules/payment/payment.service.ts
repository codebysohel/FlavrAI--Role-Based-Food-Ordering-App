import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePaymentInput, CreatePaymentMethodInput, UpdatePaymentMethodInput } from './types/payment.type';

@Injectable()
export class PaymentService {
  constructor(private readonly prisma: PrismaService) {}

  async createPayment(userId: string, userCountry: string, userRole: string, input: CreatePaymentInput) {
    // Only Admin and Manager can checkout & payment
    if (!['ADMIN', 'MANAGER'].includes(userRole)) {
      throw new ForbiddenException('Only Admin and Manager can process payments');
    }

    // Validate order exists and belongs to user's country
    const order = await this.prisma.order.findUnique({
      where: { id: input.orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.country !== userCountry) {
      throw new ForbiddenException('Order belongs to a different country');
    }

    if (order.status === 'CANCELLED') {
      throw new BadRequestException('Cannot process payment for cancelled order');
    }

    // Validate payment method exists and is active
    const paymentMethod = await this.prisma.paymentMethod.findUnique({
      where: { id: input.paymentMethodId },
    });

    if (!paymentMethod || !paymentMethod.isActive) {
      throw new NotFoundException('Payment method not found or inactive');
    }

    if (paymentMethod.country !== userCountry) {
      throw new ForbiddenException('Payment method not available in your country');
    }

    // Create payment
    const payment = await this.prisma.payment.create({
      data: {
        orderId: input.orderId,
        paymentMethodId: input.paymentMethodId,
        amount: order.totalAmount,
        status: 'COMPLETED',
        transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        processedAt: new Date(),
      },
      include: {
        order: true,
        paymentMethod: true,
      },
    });

    // Update order status to CONFIRMED
    await this.prisma.order.update({
      where: { id: input.orderId },
      data: { status: 'CONFIRMED' },
    });

    return payment;
  }

  async getPaymentMethods(country: string) {
    return this.prisma.paymentMethod.findMany({
      where: {
        country,
        isActive: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async getAllPaymentMethods(country?: string) {
    const where = country ? { country } : {};
    return this.prisma.paymentMethod.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async createPaymentMethod(userCountry: string, input: CreatePaymentMethodInput) {
    // Verify country matches user's country
    if (input.country !== userCountry) {
      throw new ForbiddenException('Cannot create payment method for different country');
    }

    return this.prisma.paymentMethod.create({
      data: {
        name: input.name,
        type: input.type as any,
        country: input.country as any,
        config: input.config,
        isActive: true,
      },
    });
  }

  async updatePaymentMethod(
    methodId: string,
    userCountry: string,
    input: UpdatePaymentMethodInput,
  ) {
    const paymentMethod = await this.prisma.paymentMethod.findUnique({
      where: { id: methodId },
    });

    if (!paymentMethod) {
      throw new NotFoundException('Payment method not found');
    }

    if (paymentMethod.country !== userCountry) {
      throw new ForbiddenException('Access denied. Payment method belongs to a different country');
    }

    return this.prisma.paymentMethod.update({
      where: { id: methodId },
      data: {
        name: input.name,
        type: input.type as any,
        isActive: input.isActive,
        config: input.config,
      },
    });
  }

  async deletePaymentMethod(methodId: string, userCountry: string) {
    const paymentMethod = await this.prisma.paymentMethod.findUnique({
      where: { id: methodId },
    });

    if (!paymentMethod) {
      throw new NotFoundException('Payment method not found');
    }

    if (paymentMethod.country !== userCountry) {
      throw new ForbiddenException('Access denied. Payment method belongs to a different country');
    }

    // Check if payment method is being used
    const paymentsCount = await this.prisma.payment.count({
      where: { paymentMethodId: methodId },
    });

    if (paymentsCount > 0) {
      throw new BadRequestException('Cannot delete payment method that has been used for payments');
    }

    return this.prisma.paymentMethod.delete({
      where: { id: methodId },
    });
  }
}
