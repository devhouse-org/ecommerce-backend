import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {

  constructor(private readonly prismaService : PrismaService){}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = await this.prismaService.category.create({
      data: {
        ...createCategoryDto,
      },
    });
    return category;
  }

  async findAll() {
    const categories = await this.prismaService.category.findMany();
    return categories;
  }

  async findOne(id: number) {
    const category = await this.prismaService.category.findUnique({
      where: {
        id: id,
      },
    });
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.prismaService.category.update({
      where: {
        id: id,
      },
      data: updateCategoryDto,
    });
    return category;
  }

  async remove(id: number) {
    const category = await this.prismaService.category.delete({
      where: {
        id: id,
      },
    });
    return category;
  }
  
  
}
