import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VariantService {

  constructor(private readonly prismaService: PrismaService) { }

  async create(createVariantDto: CreateVariantDto) {
    const { values, productId, ...variantData } = createVariantDto;

    const variant = await this.prismaService.variant.create({
      data: {
        ...variantData,
        product: {
          connect: { id: productId },
        },
        values: {
          create: values.map(valueData => ({
            name: valueData.name,
            price: valueData.price,
            image: valueData.image,
          })),
        },
      },
      include: {
        product: true,
        values: true,
      },
    });

    return variant;
  }

  async getVariantsByProductId(productId: string) {
    return this.prismaService.variant.findMany({
      where: { productId },
      include: {
        product: true,
        values: true,
      },
    });
  }

  async getAll() {
    return this.prismaService.variant.findMany({
      include: {
        product: true,
        values: true,
      },
    });
  }

  async findOne(id: string) {
    const variant = await this.prismaService.variant.findUnique({
      where: { id },
      include: {
        product: true,
        values: true,
      },
    });
    if (!variant) {
      throw new NotFoundException('Variant not found');
    }
    return variant;
  }

  async update(id: string, updateVariantDto: UpdateVariantDto) {
    const { values, productId, ...variantData } = updateVariantDto;

    const currentVariant = await this.prismaService.variant.findUnique({
      where: { id },
      include: { values: true },
    });

    if (!currentVariant) {
      throw new NotFoundException('Variant not found');
    }

    const updatedVariant = await this.prismaService.variant.update({
      where: { id },
      data: {
        ...variantData,
        product: {
          connect: { id: productId },
        },
        values: {
          deleteMany: { variantId: id },
          create: values.map(valueData => ({
            name: valueData.name,
            price: valueData.price,
            image: valueData.image,
          })),
        },
      },
      include: {
        product: true,
        values: true,
      },
    });

    return updatedVariant;
  }

  async remove(id: string) {
    const variant = await this.prismaService.variant.findUnique({ where: { id } });
    if (!variant) {
      throw new NotFoundException('Variant not found');
    }

    await this.prismaService.variant.delete({ where: { id } });
    return { message: 'Variant deleted successfully' };
  }
}
