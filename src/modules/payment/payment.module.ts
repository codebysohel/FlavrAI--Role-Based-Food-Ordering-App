import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PaymentService } from './payment.service';
import { PaymentResolver } from './payment.resolver';

@Module({
  imports: [AuthModule],
  providers: [PaymentResolver, PaymentService],
  exports: [PaymentService],
})
export class PaymentModule { }
