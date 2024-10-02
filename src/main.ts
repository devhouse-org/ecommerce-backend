import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.enableCors({
    //Add your origins here
    origin:  true
  });
  app.useGlobalPipes(new ValidationPipe(
    {
      whitelist: true, //* remove the properties that are not in the DTO
      forbidNonWhitelisted: true, //* throw an error if the properties are not in the DTO
    }
  ));

  await app.listen(3000);
}
bootstrap();
