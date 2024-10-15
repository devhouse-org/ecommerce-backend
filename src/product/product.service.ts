import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {

    constructor(private readonly prismaService: PrismaService) { }

   

async create(createProductDto: CreateProductDto) {
    const { categories, ...productData } = createProductDto;

    const product = await this.prismaService.product.create({
      data: {
        ...productData,
        category: {
          connectOrCreate: categories.map(categoryName => ({
            where: { name: categoryName },
            create: { name: categoryName },
          })),
        },
      },
      include: {
        category: true,
        ratings: true,
      },
    });

    return product;
  }
  

    // get all products by category id
    async getProductsByCategoryId(categoryId: string) {
        return this.prismaService.product.findMany({
            where: {
                category: {
                    some: {
                        id: categoryId,
                    },
                },
            },
            include: {
                category: true,
                ratings: true,
            },
        });
    }
    async getAll() {
        return this.prismaService.product.findMany({
            include: {
                category: true,
                ratings: true,
            },
        });
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
                category: true,
                ratings: true, // Make sure this is included
            }
        });
        if (!product) {
            throw new NotFoundException('Product not found');
        }
        return product;
    }


    async update(id: string, updateProductDto: UpdateProductDto) {
        const { categories, ...productData } = updateProductDto;

        // Get current categories of the product
        const currentProduct = await this.prismaService.product.findUnique({
            where: { id },
            include: { category: true },
        });

        if (!currentProduct) {
            throw new NotFoundException('Product not found');
        }

        const currentCategories = currentProduct.category.map(c => c.name);

        // Categories to disconnect (present in current but not in new)
        const categoriesToDisconnect = currentCategories.filter(
            c => !categories.includes(c)
        );

        // Categories to connect or create (present in new but not in current)
        const categoriesToConnectOrCreate = categories.filter(
            c => !currentCategories.includes(c)
        );

        const updatedProduct = await this.prismaService.product.update({
            where: { id },
            data: {
                ...productData,
                category: {
                    disconnect: categoriesToDisconnect.map(name => ({ name })),
                    connectOrCreate: categoriesToConnectOrCreate.map(name => ({
                        where: { name },
                        create: { name },
                    })),
                },
            },
            include: {
                category: true,
            },
        });

        return updatedProduct;
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
