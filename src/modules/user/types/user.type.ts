import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Role, Country } from '../../../graphql.types';

@ObjectType()
export class UserType {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field(() => Role)
  role: string;

  @Field(() => Country)
  country: string;

  @Field()
  isActive: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
