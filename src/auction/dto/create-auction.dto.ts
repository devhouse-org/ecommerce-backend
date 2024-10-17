import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

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

    @IsNumber()
    @Min(0)
    minPointsToSubscribe: number;
}
