import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as morgan from 'morgan';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger/swagger.config';
import { corsConfig } from './config/cors.config';

async function bootstrap() {
  const PORT = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors(corsConfig);
  app.use(morgan('dev'));
  app.setGlobalPrefix('api');
  await setupSwagger(app);

  await app.listen(PORT);
  const logger = new Logger('Bootstrap');
  logger.log(`Server is running on port: ${PORT} 🚀`);
}
bootstrap();
