import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderService {
  
  constructor(private readonly prismaService : PrismaService){}

  async create(createOrderDto: CreateOrderDto) {
    const order = await this.prismaService.order.create({
      data: {
        userId: createOrderDto.userId,
        total: createOrderDto.total,
        status: createOrderDto.status,
      },
    });
  }

  async findAll() {
    return await this.prismaService.order.findMany();
  }

  async findOne(id: number) {
    return await this.prismaService.order.findUnique({
      where: {
        id: id,
      },
    });
  }


  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.prismaService.order.update({
      where: {
        id: id,
      },
      data: updateOrderDto,
    });
    return order;
  }
  
 
  async remove(id: number) {
    const order = await this.prismaService.order.delete({
      where: {
        id: id,
      },
    });
    return order;
  }
}
