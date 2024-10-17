import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Type } from "class-transformer";

export class CreateAuctionDto {
    @IsString()
    @IsNotEmpty()
    productId: string;

    @IsNumber()
    @IsNotEmpty()
    startPrice: number;

    @IsNumber()
    @IsNotEmpty()
    endPrice: number;

    @IsString()
    @IsNotEmpty()
    endTime: string;
}
