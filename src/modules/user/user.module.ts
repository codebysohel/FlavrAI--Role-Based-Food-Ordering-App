import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';

@Module({
  imports: [AuthModule],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule { }
