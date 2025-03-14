import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(createOrderDto: CreateOrderDto) {
    const user = await this.prismaService.user.findUnique({
      where: { id: createOrderDto.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const formattedCart = createOrderDto.Cart.map((Cart) => ({
      productId: Cart.id,
      quantity: Cart.quantity,
      price: Cart.price,
    }));

    return await this.prismaService.$transaction(async (prisma) => {
      const order = await prisma.order.create({
        data: {
          userId: createOrderDto.userId,
          total: createOrderDto.total,
          status: createOrderDto.status,
          phoneNumber: createOrderDto.phoneNumber,
          email: createOrderDto.email,
          address: createOrderDto.address,
          name: createOrderDto.name,
          orderItems: {
            createMany: {
              data: formattedCart,
            },
          },
        },
        include: {
          orderItems: true,
        },
      });

      // Calculate points to add (you can adjust this logic as needed)
      const pointsToAdd = Math.floor(createOrderDto.total / 10); // Add 1 point for every $10 spent

      // Update user's points
      await prisma.user.update({
        where: { id: createOrderDto.userId },
        data: {
          points: {
            increment: pointsToAdd,
          },
        },
      });

      return { ...order, pointsAdded: pointsToAdd };
    });
  }

  async findAll() {
    return await this.prismaService.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { orderItems: { include: { product: true } } },
    });
  }

  async findOne(id: string) {
    const order = await this.prismaService.order.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.prismaService.order.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const updatedOrder = await this.prismaService.order.update({
      where: { id },
      data: {
        ...order, // Preserving existing properties
        ...updateOrderDto,
      },
    });
    return updatedOrder;
  }

  async remove(id: string) {
    const order = await this.prismaService.order.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    await this.prismaService.order.delete({
      where: { id },
    });
    return order;
  }

  async findByUserId(userId: string) {
    return await this.prismaService.order.findMany({
      where: { userId },
      include: { 
        orderItems: { 
          include: { product: true } 
        } 
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
