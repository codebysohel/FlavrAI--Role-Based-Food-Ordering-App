import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';

@ObjectType()
export class UserResponse {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  role: string;

  @Field()
  country: string;

  @Field()
  isActive: boolean;

  @Field()
  createdAt: Date;
}

@ObjectType()
export class AuthResponse {
  @Field()
  token: string;

  @Field(() => UserResponse)
  user: UserResponse;
}

// Input types
@InputType()
export class RegisterInput {
  @IsEmail()
  @Field()
  email: string;

  @IsString()
  @MinLength(6)
  @Field()
  password: string;

  @IsString()
  @Field()
  firstName: string;

  @IsString()
  @Field()
  lastName: string;

  @IsString()
  @Field()
  role: string;

  @IsString()
  @Field()
  country: string;
}

@InputType()
export class LoginInput {
  @IsEmail()
  @Field()
  email: string;

  @IsString()
  @Field()
  password: string;
}
