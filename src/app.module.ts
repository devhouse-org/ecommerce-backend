import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { OrderModule } from './order/order.module';
import { UserModule } from './user/user.module';
import { OrderItemModule } from './order-item/order-item.module';

@Module({
  imports: [PrismaModule, ProductModule, CategoryModule, OrderModule, UserModule, OrderItemModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
