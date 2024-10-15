import { Controller, Get, Post, Param, Body, Put, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createUser(
    @Body() userData: CreateUserDto,
    @UploadedFile() image: Express.Multer.File
  ): Promise<User> {
    return this.userService.createUser(userData, image);
  }

  @Get()
  async getAllUsers(): Promise<(Omit<User, 'image'> & { image: string })[]> {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<Omit<User, 'image'> & { image: string }> {
    return this.userService.getUserById(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async updateUser(
    @Param('id') id: string,
    @Body() userData: UpdateUserDto,
    @UploadedFile() image: Express.Multer.File
  ): Promise<Omit<User, 'image'> & { image: string }> {
    return this.userService.updateUser(id, userData, image);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
