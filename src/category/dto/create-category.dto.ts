import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class CreateCategoryDto {

    @IsString()
    @IsNotEmpty({ message: 'Field name must be added' })
    name : string
}
