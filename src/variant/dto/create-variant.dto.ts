import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateVariantDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    image?: string;

    @IsString()
    @IsNotEmpty()
    productId: string;

    @IsNotEmpty()
    values: { name: string, price?: string, image?: string }[];
}
