import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserType } from './types/user.type';
import { CurrentUser } from '../../common/decorators';
import { RolesGuard, GqlJwtGuard } from '../../common/guards';
import { Roles } from '../../common/decorators';
import { Role } from '../../graphql.types';

@Resolver(() => UserType)
@UseGuards(GqlJwtGuard, RolesGuard)
export class UserResolver {
  constructor(private readonly userService: UserService) { }

  @Query(() => UserType, { name: 'user' })
  @Roles(Role.ADMIN, Role.MANAGER)
  async findOne(@Args('id', { type: () => ID }) id: string) {
    return this.userService.findById(id);
  }

  @Query(() => [UserType], { name: 'users' })
  @Roles(Role.ADMIN)
  async findAll(@CurrentUser() user: any) {
    // Admin can see all users, others see only their country
    if (user.role === Role.ADMIN) {
      return this.userService.findAll();
    }
    return this.userService.findByCountry(user.country);
  }

  @Query(() => [UserType], { name: 'usersByCountry' })
  @Roles(Role.ADMIN, Role.MANAGER)
  async findByCountry(@Args('country') country: string) {
    return this.userService.findByCountry(country);
  }
}
