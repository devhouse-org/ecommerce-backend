import { IsNotEmpty, IsNumber, IsUUID } from "class-validator"

export class CreateOrderItemDto {

    @IsUUID()
    @IsNotEmpty()
    productId: string

    @IsUUID()
    @IsNotEmpty()
    orderId: string

    @IsNumber()
    @IsNotEmpty()
    quantity: number

    @IsNumber()
    @IsNotEmpty()
    price: number
}
