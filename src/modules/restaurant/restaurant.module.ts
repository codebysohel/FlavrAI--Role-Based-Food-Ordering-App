import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { RestaurantService } from './restaurant.service';
import { RestaurantResolver } from './restaurant.resolver';

@Module({
  imports: [AuthModule],
  providers: [RestaurantResolver, RestaurantService],
  exports: [RestaurantService],
})
export class RestaurantModule { }
