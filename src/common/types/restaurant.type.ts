import { ObjectType, Field, ID } from '@nestjs/graphql';

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

  @Field()
  country: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
