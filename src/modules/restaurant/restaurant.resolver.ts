import { Resolver, Query, Args, ID, ResolveField, Parent } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantType, MenuItemType } from './types/restaurant.type';
import { CurrentUser } from '../../common/decorators';
import { GqlJwtGuard } from '../../common/guards';

@Resolver(() => RestaurantType)
@UseGuards(GqlJwtGuard)
export class RestaurantResolver {
  constructor(private readonly restaurantService: RestaurantService) { }

  @Query(() => [RestaurantType], { name: 'restaurants' })
  async findAll(@CurrentUser() user: any) {
    // Users can only see restaurants from their country
    return this.restaurantService.findAll(user.country);
  }

  @Query(() => RestaurantType, { name: 'restaurant' })
  async findOne(@Args('id', { type: () => ID }) id: string) {
    return this.restaurantService.findById(id);
  }

  @Query(() => [MenuItemType], { name: 'menuItems' })
  async findAllMenuItems(@CurrentUser() user: any) {
    return this.restaurantService.findMenuItems(user.country);
  }

  @Query(() => [MenuItemType], { name: 'restaurantMenu' })
  async findRestaurantMenu(
    @Args('restaurantId', { type: () => ID }) restaurantId: string,
    @CurrentUser() user: any,
  ) {
    return this.restaurantService.findMenuByRestaurantId(restaurantId, user.country);
  }

  @ResolveField(() => [MenuItemType])
  async menuItems(@Parent() restaurant: RestaurantType, @CurrentUser() user: any) {
    return this.restaurantService.findMenuByRestaurantId(restaurant.id, user.country);
  }
}
