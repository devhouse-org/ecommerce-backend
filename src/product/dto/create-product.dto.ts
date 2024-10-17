// src/product/dto/create-product.dto.ts

import { IsString, IsNotEmpty, IsNumber, IsArray, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Type(() => Number)
  price: number;

  @IsArray()
  @IsString({ each: true })
  categories: string[];

  @IsOptional()
  @IsString()
  image?: string; // Now expects a base64 string
  
  @IsOptional()
  @IsBoolean()
  published: boolean;
}
