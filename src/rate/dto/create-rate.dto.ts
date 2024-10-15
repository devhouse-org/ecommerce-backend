import { IsNotEmpty, IsUUID, IsInt, Min, Max, IsString, IsOptional } from 'class-validator';

export class CreateRateDto {
  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  score: number;

  @IsOptional()
  @IsString()
  comment?: string;
}
