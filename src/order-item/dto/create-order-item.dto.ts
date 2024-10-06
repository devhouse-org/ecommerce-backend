import { IsNotEmpty, IsNumber } from "class-validator"

export class CreateOrderItemDto {

    @IsNumber()
    @IsNotEmpty()
    productId : string
    
    @IsNumber()
    @IsNotEmpty()
    orderId : string
        
    @IsNumber()
    @IsNotEmpty()
    quantity : number

    @IsNumber()
    @IsNotEmpty()
    price : number
}
