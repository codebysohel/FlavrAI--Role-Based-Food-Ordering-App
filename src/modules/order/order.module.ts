import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';

@Module({
  imports: [AuthModule],
  providers: [OrderResolver, OrderService],
  exports: [OrderService],
})
export class OrderModule { }
