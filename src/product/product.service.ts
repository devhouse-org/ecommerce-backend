import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {

    constructor(private readonly prismaService: PrismaService) { }

    async create(createProductDto: CreateProductDto) {
        const { categoryIds, ...productData } = createProductDto;

        const categories = await this.prismaService.category.findMany({
            where: {
                id: {
                    in: categoryIds,
                },
            },
        });

        if (categories.length !== categoryIds.length) {
            throw new NotFoundException('One or more categories not found');
        }

        const product = await this.prismaService.product.create({
            data: {
                ...productData,
                category: {
                    connect: categoryIds.map(id => ({ id })),
                },
            },
            include: {
                category: true,
            },
        });

        return product;
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
        const product = await this.prismaService.product.findUnique({
            where: { id },
            include: {
                category: true
            }
        });
        if (!product) {
            throw new NotFoundException('Product not found');
        }
        return product;
    }


    async update(id: string, updateProductDto: UpdateProductDto) {
        const { categoryIds, ...productData } = updateProductDto;

        // Check if the product exists
        const product = await this.prismaService.product.findUnique({ where: { id } });
        if (!product) {
            throw new NotFoundException('Product not found');
        }
        await this.prismaService.product.update({
            where: { id },
            data: {
                ...productData,
                category: categoryIds ? {
                    set: categoryIds.map(id => ({ id })), // Replace categories with new ones
                } : undefined,
            },
        });
        return { message: 'Product updated successfully' };
    }


    async remove(id: string) {
        const product = await this.prismaService.product.findUnique({ where: { id } });
        console.log(product)
        if (!product) {
            throw new NotFoundException('Product not found');
        }
        await this.prismaService.product.delete({ where: { id } });
        return { message: 'Product deleted successfully' };
    }
}
