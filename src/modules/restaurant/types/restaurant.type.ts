import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Country } from '../../../graphql.types';

@ObjectType()
export class RestaurantType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  address: string;

  @Field()
  city: string;

  @Field()
  rating: number;

  @Field()
  isActive: boolean;

  @Field(() => Country)
  country: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class MenuItemType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  price: number;

  @Field()
  category: string;

  @Field()
  isVegetarian: boolean;

  @Field()
  isAvailable: boolean;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field()
  restaurantId: string;

  @Field(() => RestaurantType, { nullable: true })
  restaurant?: RestaurantType;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
