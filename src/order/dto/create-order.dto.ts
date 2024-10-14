import { OrderItem, OrderStatus } from "@prisma/client";
import {
    IsArray,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    ValidateNested
} from "class-validator";
import { Type } from "class-transformer";

export class CreateOrderDto {

    @IsUUID()
    @IsNotEmpty({ message: 'Field userId must be added' })
    userId: string;

    @IsNumber()
    @IsNotEmpty()
    total: number;

    @IsArray()
    @ValidateNested({ each: true }) // Validate each product in the array
    @Type(() => Cart) // Transform plain objects into Product instances
    @IsNotEmpty({ message: 'Products field cannot be empty' })
    Cart: Cart[];

    @IsEnum(OrderStatus)
    @IsNotEmpty()
    status: OrderStatus;

    @IsString()
    @IsNotEmpty()
    phoneNumber: string;

    @IsOptional()
    @IsString()
    name?: string;

    @IsString()
    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsNotEmpty()
    address: string;
}

export class Cart {
    @IsUUID() // Validate that id is a UUID
    @IsNotEmpty({ message: 'Field id must be added' })
    id: string;

    @IsNumber()
    @IsNotEmpty({ message: 'Field quantity must be added' })
    quantity: number;

    @IsNumber()
    @IsNotEmpty({ message: 'Field price must be added' })
    price: number;
}