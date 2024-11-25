import { Body, Controller, Get, HttpException, HttpStatus, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { Roles } from '@prisma/client';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly prisma: PrismaService) { }

  // create a user endpoint for admin
  @Get('seed/admin')
  async createSuperUser() {
    // create a super user with the email admin@admin.com and the password admin
    const superUser = await this.prisma.user.create({
      data: {
        email: 'admin@admin.com',
        password: 'admin',
        name: 'Super Admin',
        role: 'ADMIN',
      },
    });
    return superUser;
  }
  // create admin user endpoint
  @Get('admin/create')
  async createAdminUser() {
    return this.prisma.user.create({ data: {
      email: "admin@admin.com",
      password: "admin",
      name: "Super Admin",
      role: Roles.ADMIN,
    } });
  }
  // seed end point
  @Get('seed/users')
  async seed() {
    const dummyUsers = Array.from({ length: 20 }, (_, index) => ({
      email: `user${index + 1}@example.com`,
      password: 'password123', // Use a hashed password in production
      name: `User ${index + 1}`,
    }));

    await this.prisma.user.createMany({
      data: dummyUsers,
      skipDuplicates: true, // In case users with the same email already exist
    });
    return 'Seeding done';
  }
  // another seed endpoint
  @Get('seed/categories')
  async seedCategories() {
    // Create 10 dummy categories
    const dummyCategories = Array.from({ length: 10 }, (_, index) => ({
      name: `Category ${index + 1}`,
    }));

    const categories = await this.prisma.category.createMany({
      data: dummyCategories,
      skipDuplicates: true, // In case categories with the same name already exist
    });

    console.log(`${dummyCategories.length} categories created!`);

    // Create 50 dummy products
    const dummyProducts = Array.from({ length: 50 }, (_, index) => ({
      name: `Product ${index + 1}`,
      description: `Description for Product ${index + 1}`,
      price: Math.random() * 100, // Random price between 0 and 100
      imageUrl: `https://via.placeholder.com/150?text=Product+${index + 1}`,

    }));

    await this.prisma.product.createMany({
      data: dummyProducts,
      skipDuplicates: true,
    });
    return `${dummyProducts.length} products created!`;
  }

  // another seed endpoint
  @Get('seed/connect-categories-to-products')
  async seedOrders() {
    try {
      // Fetch all products and categories
      const products = await this.prisma.product.findMany();
      const categories = await this.prisma.category.findMany();

      if (products.length === 0 || categories.length === 0) {
        throw new HttpException(
          'No products or categories available',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Randomly connect products to categories
      for (const product of products) {
        // Get a random number of categories to assign to the product
        const randomCategoryCount = Math.floor(Math.random() * categories.length) + 1;
        // Shuffle categories and take a random number of them
        const randomCategories = this.shuffleArray(categories).slice(0, randomCategoryCount);

        // Connect the product with the selected random categories
        await this.prisma.product.update({
          where: { id: product.id },
          data: {
            category: {
              connect: randomCategories.map((category) => ({ id: category.id })),
            },
          },
        });
      }

      return { message: 'Random categories assigned to products successfully' };
    } catch (error) {
      throw new HttpException('Failed to connect categories', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
