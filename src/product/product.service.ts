import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {

    constructor(private readonly prismaService : PrismaService){}

    async create(createProductDto: CreateProductDto) {
        const product = await this.prismaService.product.create({
            data : {
                ...createProductDto,
            }
        })
        return product
    }


    async findAll() {
        const products = await this.prismaService.product.findMany()
        return products
    }


    async findOne(id: number) {
        const product = await this.prismaService.product.findFirst({
            where : {
                id : id
            }
        })
        return product
    }


    async update(id: number, updateProductDto: UpdateProductDto) {
        const product = await this.prismaService.product.update({
            where : {
                id : id
            },
            data : updateProductDto
        })
        return product
    }


    async remove(id: number) {
        const product = await this.prismaService.product.delete({
            where : {
                id : id
            }
        })
        return product
    }
}
