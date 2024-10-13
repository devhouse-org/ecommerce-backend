// src/product/dto/create-product.dto.ts

import { IsString, IsNotEmpty, IsNumber, IsArray, ArrayNotEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Type(() => Number) // Ensures transformation from string to number
  price: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  categoryIds: string[];

  @IsOptional()
  @IsString()
  image?: string; // Optional field to hold the image URL
}
