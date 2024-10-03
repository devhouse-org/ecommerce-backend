import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderService {
  
  constructor(private readonly prismaService : PrismaService){}

  async create(createOrderDto: CreateOrderDto) {
    const user = await this.prismaService.user.findUnique({ where: { id: createOrderDto.userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const order = await this.prismaService.order.create({
      data: {
        ...createOrderDto,
      },
    });
    return order;
  }

  async findAll() {
    return await this.prismaService.order.findMany();
  }

  async findOne(id: number) {
    const order = await this.prismaService.order.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }


  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.prismaService.order.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    const updatedOrder = await this.prismaService.order.update({
      where: {
        id: id,
      },
      data: updateOrderDto,
    });
    return order;
  }
  
 
  async remove(id: number) {
    const order = await this.prismaService.order.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    await this.prismaService.order.delete({
      where: {
        id: id,
      },
    });
    return order;
  }
}
