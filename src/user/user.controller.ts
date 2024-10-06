import { Controller, Get, Post, Param, Body, Put, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { Prisma } from '@prisma/client';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() userData: Prisma.UserCreateInput): Promise<User> {
    return this.userService.createUser(userData);
  }

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    return this.userService.getUserById(id);
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() userData: Prisma.UserUpdateInput): Promise<User> {
    return this.userService.updateUser(id, userData);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<User> {
    return this.userService.deleteUser(id);
  }
}
