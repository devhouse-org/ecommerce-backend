import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {

  constructor(private readonly prismaService: PrismaService) { }

  async create(createCategoryDto: CreateCategoryDto) {
    const cat = await this.prismaService.category.findUnique({ where: { name: createCategoryDto.name } })

    if (cat) throw new BadRequestException("Category already exists")

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

  async findOne(id: string) {
    const category = await this.prismaService.category.findUnique({
      where: {
        id: id,
      },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.prismaService.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    await this.prismaService.category.update({
      where: { id },
      data: updateCategoryDto,
    });
    return { message: 'Category updated successfully' };
  }

  async remove(id: string) {
    const category = await this.prismaService.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    await this.prismaService.category.delete({ where: { id } });
    return { message: 'Category deleted successfully' };
  }
}
