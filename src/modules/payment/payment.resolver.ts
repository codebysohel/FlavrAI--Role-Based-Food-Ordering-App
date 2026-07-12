import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentType, PaymentMethodTypeObj, CreatePaymentInput, CreatePaymentMethodInput, UpdatePaymentMethodInput } from './types/payment.type';
import { CurrentUser } from '../../common/decorators';
import { Roles } from '../../common/decorators';
import { Role } from '../../graphql.types';
import { GqlJwtGuard, RolesGuard } from '../../common/guards';

@Resolver(() => PaymentType)
@UseGuards(GqlJwtGuard, RolesGuard)
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) { }

  @Mutation(() => PaymentType)
  @Roles(Role.ADMIN, Role.MANAGER)
  async createPayment(
    @Args('input') input: CreatePaymentInput,
    @CurrentUser() user: any,
  ) {
    return this.paymentService.createPayment(user.userId, user.country, user.role, input);
  }

  @Query(() => [PaymentMethodTypeObj], { name: 'paymentMethods' })
  async getPaymentMethods(@CurrentUser() user: any) {
    return this.paymentService.getPaymentMethods(user.country);
  }

  @Query(() => [PaymentMethodTypeObj], { name: 'allPaymentMethods' })
  @Roles(Role.ADMIN, Role.MANAGER)
  async getAllPaymentMethods(@CurrentUser() user: any) {
    return this.paymentService.getAllPaymentMethods(user.country);
  }

  @Mutation(() => PaymentMethodTypeObj)
  @Roles(Role.ADMIN)
  async createPaymentMethod(
    @Args('input') input: CreatePaymentMethodInput,
    @CurrentUser() user: any,
  ) {
    return this.paymentService.createPaymentMethod(user.country, input);
  }

  @Mutation(() => PaymentMethodTypeObj)
  @Roles(Role.ADMIN)
  async updatePaymentMethod(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdatePaymentMethodInput,
    @CurrentUser() user: any,
  ) {
    return this.paymentService.updatePaymentMethod(id, user.country, input);
  }

  @Mutation(() => PaymentMethodTypeObj)
  @Roles(Role.ADMIN)
  async deletePaymentMethod(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: any,
  ) {
    return this.paymentService.deletePaymentMethod(id, user.country);
  }
}
