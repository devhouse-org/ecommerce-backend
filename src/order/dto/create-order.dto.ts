import { OrderItem, OrderStatus } from "@prisma/client"
import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator"

export class CreateOrderDto {

    @IsUUID()
    @IsNotEmpty({ message: 'Field userId must be added' })
    userId: string

    @IsNumber()
    @IsNotEmpty()
    total: number

    @IsNotEmpty()
    products: Product[]

    @IsEnum(OrderStatus)
    @IsNotEmpty()
    status: OrderStatus


    @IsString()
    @IsNotEmpty()
    phoneNumber: string

    @IsOptional()
    @IsString()
    name: string

    @IsString()
    @IsEmail()
    @IsOptional()
    email: string

    @IsString()
    @IsNotEmpty()
    address: string
}

class Product {
    id: string
    quantity: number
    price: number
}