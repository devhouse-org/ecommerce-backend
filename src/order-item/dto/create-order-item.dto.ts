import { IsNotEmpty, IsNumber } from "class-validator"

export class CreateOrderItemDto {

    @IsNumber()
    @IsNotEmpty()
    productId : number
    
    @IsNumber()
    @IsNotEmpty()
    orderId : number
        
    @IsNumber()
    @IsNotEmpty()
    quantity : number

    @IsNumber()
    @IsNotEmpty()
    price : number
}
