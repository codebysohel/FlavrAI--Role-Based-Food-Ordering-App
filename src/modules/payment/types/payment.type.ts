import { ObjectType, Field, ID, InputType } from '@nestjs/graphql';
import { PaymentStatus, PaymentMethodType, Country } from '../../../graphql.types';

@ObjectType()
export class PaymentType {
  @Field(() => ID)
  id: string;

  @Field()
  orderId: string;

  @Field()
  paymentMethodId: string;

  @Field()
  amount: number;

  @Field(() => PaymentStatus)
  status: string;

  @Field({ nullable: true })
  transactionId?: string;

  @Field({ nullable: true })
  processedAt?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class PaymentMethodTypeObj {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => PaymentMethodType)
  type: string;

  @Field()
  isActive: boolean;

  @Field(() => Country)
  country: string;

  @Field({ nullable: true })
  config?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

// Input types
import { IsString, IsUUID, IsOptional, IsBoolean } from 'class-validator';

@InputType()
export class CreatePaymentInput {
  @Field()
  @IsUUID()
  orderId: string;

  @Field()
  @IsUUID()
  paymentMethodId: string;
}

@InputType()
export class CreatePaymentMethodInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  type: string;

  @Field()
  @IsString()
  country: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  config?: string;
}

@InputType()
export class UpdatePaymentMethodInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  type?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  config?: string;
}
