import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Assuming you have a Prisma service set up
import { Prisma, User, Roles } from '@prisma/client'; // Assuming you're using Prisma
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async createUser(data: CreateUserDto, image?: Express.Multer.File): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const userData: Prisma.UserCreateInput = {
      ...data,
      role: data.role as Roles,
      image: image ? image.buffer : undefined,
    };

    return this.prisma.user.create({ data: userData });
  }

  async getAllUsers(): Promise<(Omit<User, 'image'> & { image: string | null })[]> {
    const users = await this.prisma.user.findMany({ include: { orders: true } });
    return users.map(user => ({
      ...user,
      image: user.image ? user.image.toString('base64') : null,
    }));
  }

  async getUserById(id: string): Promise<Omit<User, 'image'> & { image: string | null }> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { orders: true }
    });
    if (user) {
      return {
        ...user,
        image: user.image ? user.image.toString('base64') : null,
      };
    }
    return null;
  }

  async updateUser(id: string, data: UpdateUserDto, image?: Express.Multer.File): Promise<Omit<User, 'image'> & { image: string | null }> {
    const updateData: Prisma.UserUpdateInput = {
      ...data,
      image: image ? image.buffer : undefined,
    };

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
    });

    return {
      ...updatedUser,
      image: updatedUser.image ? updatedUser.image.toString('base64') : null,
    };
  }

  async deleteUser(id: string) {
    const userOrders = await this.prisma.order.findMany({ where: { userId: id } })

    const hasPendingOrder = userOrders.filter(order => order.status === "PENDING")

    if (hasPendingOrder.length > 0) {
      throw new BadRequestException("Pending orders: delete the account after the orders are delivered")
    } else {
      return this.prisma.user.delete({
        where: { id },
      });
    }
  }

  async findOne(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email: username },
    });
  }
}
