import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderItemService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(createOrderItemDto: CreateOrderItemDto) {
    const order = await this.prismaService.order.findUnique({ where: { id: createOrderItemDto.orderId } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    const product = await this.prismaService.product.findUnique({ where: { id: createOrderItemDto.productId } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const orderItem = await this.prismaService.orderItem.create({
      data: {
        ...createOrderItemDto
      },
    });
    return orderItem;
  }

  async findAll() {
    const orderItems = await this.prismaService.orderItem.findMany();
    return orderItems;
  }

  async findOne(id: number) {
    const orderItem = await this.prismaService.orderItem.findUnique({ where: { id } });
    if (!orderItem) {
      throw new NotFoundException('Order item not found');
    }
    return orderItem;
  }

  async update(id: number, updateOrderItemDto: UpdateOrderItemDto) {
    const orderItem = await this.prismaService.orderItem.findUnique({ where: { id } });
    if (!orderItem) {
      throw new NotFoundException('Order item not found');
    }
    const updatedOrderItem = await this.prismaService.orderItem.update({
      where: { id },
      data: updateOrderItemDto,
    });
    return updatedOrderItem;
  }

  async remove(id: number) {
    const orderItem = await this.prismaService.orderItem.findUnique({ where: { id } });
    if (!orderItem) {
      throw new NotFoundException('Order item not found');
    }
    await this.prismaService.orderItem.delete({ where: { id } });
    return orderItem;
  }
}
