import { Order } from "@prisma/client"
import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateUserDto {

    @IsString()
    @IsNotEmpty()
    email : string
    
    @IsString()
    @IsNotEmpty()
    password : string

    @IsString()
    @IsOptional()
    name : string

    // orders relationship
    @IsArray()
    @IsOptional()
    orders : Order[]


}
