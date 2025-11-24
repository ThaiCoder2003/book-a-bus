import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Apply the ValidationPipe globally to enforce DTO validation
  app.useGlobalPipes(
    new ValidationPipe({
      // Strip properties that do not have any validation decorators
      whitelist: true,
      // Throw an error if extraneous properties are sent
      forbidNonWhitelisted: true,
      // Automatically convert payloads to their DTO types (e.g., strings to numbers)
      transform: true,
    }),
  );

  // Set a global route prefix, e.g., /api/auth/login
  app.setGlobalPrefix('api');
  app.enableCors(); // Mặc định cho phép tất cả các nguồn

  // Read port from environment variables, default to 3000
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/api`);
}
bootstrap();
