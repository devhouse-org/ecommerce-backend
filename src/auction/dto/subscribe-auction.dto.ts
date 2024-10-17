import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class SubscribeAuctionDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}
