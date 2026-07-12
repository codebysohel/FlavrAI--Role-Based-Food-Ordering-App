import { ObjectType, Field, ID, InputType, Int } from '@nestjs/graphql';
import { OrderStatus, Role, Country } from '../../../graphql.types';
import { IsUUID, IsString, IsOptional, IsArray, ValidateNested, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

@ObjectType()
export class OrderType {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field()
  restaurantId: string;

  @Field(() => OrderStatus)
  status: string;

  @Field()
  totalAmount: number;

  @Field({ nullable: true })
  notes?: string;

  @Field()
  country: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class OrderItemType {
  @Field(() => ID)
  id: string;

  @Field()
  orderId: string;

  @Field()
  menuItemId: string;

  @Field()
  quantity: number;

  @Field()
  unitPrice: number;

  @Field()
  totalPrice: number;

  @Field()
  createdAt: Date;
}

@ObjectType()
export class OrderWithDetails extends OrderType {
  @Field(() => [OrderItemType])
  items: OrderItemType[];

  @Field()
  restaurantName: string;
}

// Input types
@InputType()
export class OrderItemInput {
  @Field()
  @IsUUID()
  menuItemId: string;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  quantity: number;
}

@InputType()
export class CreateOrderInput {
  @Field()
  @IsUUID()
  restaurantId: string;

  @Field(() => [OrderItemInput])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemInput)
  items: OrderItemInput[];

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;
}

@InputType()
export class UpdateOrderStatusInput {
  @Field()
  @IsUUID()
  orderId: string;

  @Field()
  @IsString()
  status: string;
}
