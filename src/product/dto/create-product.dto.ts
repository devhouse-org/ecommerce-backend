import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class CreateProductDto {

    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    description: string

    @IsNumber()
    @IsNotEmpty()
    price: number

    @IsString()
    @IsOptional()
    imageUrl: string

    @IsArray()
    @ArrayMinSize(1)
    @IsString({ each: true }) // Ensures each category ID is a string
    categoryIds: string[]

}
