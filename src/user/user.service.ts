import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Assuming you have a Prisma service set up
import { Prisma, User } from '@prisma/client'; // Assuming you're using Prisma

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async getUserById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }
  async findOne(username: string): Promise<User | undefined> {
    return this.prisma.user.findUnique({
      where: { email: username },
    });
  }
  async updateUser(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(id: string): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
