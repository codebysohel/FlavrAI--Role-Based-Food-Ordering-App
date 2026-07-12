import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderType, OrderWithDetails, CreateOrderInput, UpdateOrderStatusInput } from './types/order.type';
import { CurrentUser } from '../../common/decorators';
import { Roles } from '../../common/decorators';
import { Role } from '../../graphql.types';
import { GqlJwtGuard, RolesGuard } from '../../common/guards';

@Resolver(() => OrderWithDetails)
@UseGuards(GqlJwtGuard, RolesGuard)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) { }

  @ResolveField('restaurantName', () => String)
  resolveRestaurantName(@Parent() order: any) {
    if (order.restaurantName) {
      return order.restaurantName;
    }
    return order.restaurant?.name || '';
  }

  @Mutation(() => OrderWithDetails)
  async createOrder(
    @Args('input') input: CreateOrderInput,
    @CurrentUser() user: any,
  ) {
    return this.orderService.create(user.userId, user.country, input);
  }

  @Query(() => [OrderType], { name: 'myOrders' })
  async myOrders(@CurrentUser() user: any) {
    return this.orderService.findByUserId(user.userId, user.country);
  }

  @Query(() => OrderWithDetails, { name: 'order' })
  async findOne(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: any,
  ) {
    return this.orderService.findById(id, user.country, user.role);
  }

  @Query(() => [OrderWithDetails], { name: 'orders' })
  @Roles(Role.ADMIN, Role.MANAGER)
  async findAll(@CurrentUser() user: any) {
    return this.orderService.findAllByCountry(user.country);
  }

  @Mutation(() => OrderWithDetails)
  @Roles(Role.ADMIN, Role.MANAGER)
  async updateOrderStatus(
    @Args('input') input: UpdateOrderStatusInput,
    @CurrentUser() user: any,
  ) {
    return this.orderService.updateStatus(input.orderId, user.country, user.role, input);
  }

  @Mutation(() => OrderWithDetails)
  @Roles(Role.ADMIN, Role.MANAGER)
  async cancelOrder(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: any,
  ) {
    return this.orderService.cancelOrder(id, user.userId, user.country, user.role);
  }
}
