import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {

    constructor(private readonly prismaService: PrismaService) { }

    async create(createProductDto: CreateProductDto) {
        const product = await this.prismaService.product.create({
            data: {
                ...createProductDto,
            }
        })
        return product
    }

    async getAll() {
        return this.prismaService.product.findMany();
    }

    async findAll(categoryId: string) {
        const products = await this.prismaService.category.findUnique({
            where: {
                id: categoryId,
            },
            include: {
                products: true,
            }
        })
        return products
    }


    async findOne(id: string) {
        const product = await this.prismaService.product.findUnique({ where: { id } });
        if (!product) {
            throw new NotFoundException('Product not found');
        }
        return product;
    }


    async update(id: string, updateProductDto: UpdateProductDto) {
        const product = await this.prismaService.product.findUnique({ where: { id } });
        if (!product) {
            throw new NotFoundException('Product not found');
        }
        await this.prismaService.product.update({
            where: { id },
            data: updateProductDto
        });
        return { message: 'Product updated successfully' };
    }


    async remove(id: string) {
        const product = await this.prismaService.product.findUnique({ where: { id } });
        if (!product) {
            throw new NotFoundException('Product not found');
        }
        await this.prismaService.product.delete({ where: { id } });
        return { message: 'Product deleted successfully' };
    }
}
