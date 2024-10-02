import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class CreateCategoryDto {

    @IsString()
    @IsNotEmpty()
    name : string

    @IsString()
    @IsOptional()
    imageUrl : string

    @IsNumber()
    @IsNotEmpty()
    productId : number
}
