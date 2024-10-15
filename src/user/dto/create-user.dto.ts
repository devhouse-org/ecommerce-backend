import { IsEmail, IsString, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { Roles } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(Roles)
  @IsNotEmpty()
  role: Roles;
  // phone
  @IsString()
  @IsOptional()
  phone?: string;
}