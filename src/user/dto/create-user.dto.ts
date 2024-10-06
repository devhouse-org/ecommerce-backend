import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateUserDto {
    @IsString()
    @IsOptional()
    name : string
    
    @IsString()
    @IsNotEmpty()
    email : string
    
    @IsString()
    @IsNotEmpty()
    password : string
}
