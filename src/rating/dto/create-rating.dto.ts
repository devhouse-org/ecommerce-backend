import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateRatingDto {
    
    @IsNumber()
    @IsNotEmpty({ message: 'Field score must be added' })
    score: number;

    @IsString()
    @IsNotEmpty({ message: 'Field comments must be added' })
    comment: string

    @IsString()
    userId: string

    @IsString()
    productId: string
}
