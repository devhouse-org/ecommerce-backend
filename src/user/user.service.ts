import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  // get all users
  async findAll() {
    return this.prismaService.user.findMany();
  }

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({ where: { email: username } });

    if (!user || user.password !== password) { // In a real application, make sure to hash the password and compare the hashed values
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }


  async register(email: string, password: string): Promise<Omit<User, 'password'>> {
    if (!email || !password) {
      throw new BadRequestException('email and password are required');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await this.prismaService.user.create({
      email: email,
      password: hashedPassword,
    });


    const { password: _, ...result } = user;
    return result;
  }

  create(username: string, password: string): Promise<User> {
    const user = new User();
    user.username = username;
    user.password = password;

    return this.usersRepository.save(user);
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
