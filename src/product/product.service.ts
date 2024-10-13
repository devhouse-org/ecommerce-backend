import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {

    constructor(private readonly prismaService: PrismaService) { }

   // src/product/product.service.ts

async create(createProductDto: CreateProductDto) {
    // Log received DTO
    console.log('Received CreateProductDto:', createProductDto);
  
    // Check categories existence
    const categories = await this.prismaService.category.findMany({
      where: { id: { in: createProductDto.categoryIds } },
    });
  
    if (categories.length !== createProductDto.categoryIds.length) {
      throw new NotFoundException('One or more categories not found');
    }
  
    // Create the product with the correct field name
    const product = await this.prismaService.product.create({
      data: {
        name: createProductDto.name,
        description: createProductDto.description,
        price: createProductDto.price,
        imageUrl: createProductDto.image, // Correct field name
        category: {
          connect: createProductDto.categoryIds.map(id => ({ id })),
        },
      },
      include: {
        category: true,
      },
    });
  
    console.log('Created Product:', product);
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
