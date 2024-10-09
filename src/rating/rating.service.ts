import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RatingService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(createRatingDto: CreateRatingDto) {
    const rating = await this.prismaService.rating.create({
      data: {
        ...createRatingDto,
      },
    });
    return rating;
  }

  async findAll() {
    const rating = await this.prismaService.rating.findMany({
      include: {
        product: true,
        user: true
      }
    });
    return rating
  }

  async findOne(id: string) {
    const rating = await this.prismaService.rating.findUnique({
      where: {
        id: id,
      },
      include: {
        product: true,
        user: true
      }
    });
    if (!rating) {
      throw new NotFoundException('Rating not found');
    }
    return rating;
  }

  async update(id: string, updateRatingDto: UpdateRatingDto) {
    const rating = await this.prismaService.rating.findUnique({ where: { id } });
    if (!rating) {
      throw new NotFoundException('Rating not found');
    }
    await this.prismaService.rating.update({
      where: { id },
      data: updateRatingDto
    });

    return { message: 'Rating updated successfully' };
  }

  async remove(id: string) {
    const rating = await this.prismaService.rating.findUnique({ where: { id } });
    if (!rating) {
      throw new NotFoundException('Rating not found');
    }
    await this.prismaService.rating.delete({ where: { id } });
    return { message: 'Rating deleted successfully' };
  }
}
