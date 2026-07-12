import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * CountryGuard - ReBAC (Relationship-Based Access Control)
 * Ensures users can only access data within their assigned country
 */
@Injectable()
export class CountryGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    const user = req.user;

    if (!user) {
      return false;
    }

    // Admins can access all countries (optional - remove this if you want strict country restriction)
    if (user.role === 'ADMIN') {
      return true;
    }

    // Extract country from request arguments
    const args = ctx.getArgs();
    
    // Check if the requested country matches user's country
    if (args.country && args.country !== user.country) {
      throw new ForbiddenException(
        `Access denied. You can only access data from your assigned country: ${user.country}`,
      );
    }

    // For mutations/queries with ID, verify the resource belongs to user's country
    if (args.id) {
      await this.validateResourceCountry(args.id, user.country, context);
    }

    return true;
  }

  private async validateResourceCountry(
    id: string,
    userCountry: string,
    context: ExecutionContext,
  ): Promise<void> {
    const handlerName = context.getHandler().name;
    
    // Determine which table to check based on the resolver context
    let model: any;
    
    if (handlerName.includes('restaurant') || handlerName.includes('Restaurant')) {
      model = this.prisma.restaurant;
    } else if (handlerName.includes('order') || handlerName.includes('Order')) {
      model = this.prisma.order;
    } else if (handlerName.includes('payment') || handlerName.includes('Payment')) {
      const payment = await this.prisma.payment.findUnique({
        where: { id },
        include: { paymentMethod: true },
      });
      
      if (payment && payment.paymentMethod.country !== userCountry) {
        throw new ForbiddenException('Access denied. This payment method is not available in your country');
      }
      return;
    } else {
      return; // Skip validation if we can't determine the model
    }

    if (model) {
      const resource = await model.findUnique({ where: { id } });
      if (resource && resource.country !== userCountry) {
        throw new ForbiddenException('Access denied. This resource belongs to a different country');
      }
    }
  }
}
