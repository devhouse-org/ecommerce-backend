import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRateDto } from './dto/create-rate.dto';
import { UpdateRateDto } from './dto/update-rate.dto';

@Injectable()
export class RateService {
  constructor(private prisma: PrismaService) {}

  async create(createRateDto: CreateRateDto, userId: string) {
    const { productId, score, comment } = createRateDto;

    // Check if the product exists
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // Check if the user has already rated this product
    const existingRating = await this.prisma.rating.findFirst({
      where: {
        userId: userId,
        productId: productId,
      },
    });

    if (existingRating) {
      throw new UnauthorizedException('You have already rated this product');
    }

    // Create the new rating
    const newRating = await this.prisma.rating.create({
      data: {
        score,
        comment,
        userId,
        productId,
      },
    });

    return newRating;
  }

  async findAllByProductId(productId: string) {
    return await this.prisma.rating.aggregate({
      _avg: { score: true },
      where: { productId },
    });
  }

  async findAll() {
    return await this.prisma.rating.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.rating.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateRateDto: UpdateRateDto, userId: string) {
    return await this.prisma.rating.update({
      where: { id },
      data: updateRateDto,
    });
  }

  async remove(id: string, userId: string) {
    return await this.prisma.rating.delete({
      where: { id },
    });
  }

  async hasUserRatedProduct(userId: string, productId: string): Promise<boolean> {
    const existingRating = await this.prisma.rating.findFirst({
      where: {
        userId: userId,
        productId: productId,
      },
    });

    return !!existingRating;
  }
}
