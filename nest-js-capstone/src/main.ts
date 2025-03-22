// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(process.env.PORT ?? 3000);
// }
// bootstrap();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // add validation input
  app.useGlobalPipes(new ValidationPipe());

  // config swagger UI
  const configSwagger = new DocumentBuilder()
    .setTitle('API NEST JS')
    .setDescription("Danh sách API ")
    .setVersion("1.0")
    .addBearerAuth( // 🔥 Quan trọng: Thêm Bearer Auth
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token', // 🔹 Tên này sẽ xuất hiện trên Swagger UI
    )
    .build(); // builder pattern
  
    // apply config to swagger
  const swagger = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup("api", app, swagger);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
