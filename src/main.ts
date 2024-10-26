import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import "dotenv/config";
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.enableCors({
    origin:  ['https://ecommerce-dashboord.netlify.app', 'http://localhost:5174', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe(
    {
      whitelist: true, //* remove the properties that are not in the DTO
      forbidNonWhitelisted: true, //* throw an error if the properties are not in the DTO
    }
  ));

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
