import { OrderItem, OrderStatus } from "@prisma/client"
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsUUID } from "class-validator"

export class CreateOrderDto {

    @IsUUID()
    @IsNotEmpty({ message: 'Field userId must be added' })
    userId: string


    @IsNumber()
    @IsNotEmpty()
    total: number

    @IsEnum(OrderStatus)
    @IsNotEmpty()
    status: OrderStatus
}
