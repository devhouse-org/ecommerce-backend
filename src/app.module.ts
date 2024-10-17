import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { OrderModule } from './order/order.module';
import { UserModule } from './user/user.module';
import {ServeStaticModule} from '@nestjs/serve-static'
import { OrderItemModule } from './order-item/order-item.module';
import { AuthModule } from './auth/auth.module';
import { join } from 'path';
import { StaticsModule } from './statics/statics.module';
import { RateModule } from './rate/rate.module';
import { VariantModule } from './variant/variant.module';

@Module({
  imports: [PrismaModule, ProductModule, CategoryModule, OrderModule, UserModule, OrderItemModule, AuthModule,ServeStaticModule.forRoot({
    serveRoot: '/public',
    rootPath: join(__dirname, '..', 'public'),
  }), StaticsModule, RateModule, VariantModule,],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
