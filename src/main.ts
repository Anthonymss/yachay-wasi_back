import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import * as morgan from 'morgan';
import { AppModule } from './app.module';
import { corsConfig } from './config/cors.config';
import cors from '@fastify/cors';
import { setupSwagger } from './config/swagger/swagger.config';
import fastifyMultipart from '@fastify/multipart';
import fastifyHelmet from '@fastify/helmet';
async function bootstrap() {
  const PORT = process.env.PORT || 3000;
  const fastifyAdapter = new FastifyAdapter();
  await fastifyAdapter.register(cors, corsConfig);
  await fastifyAdapter.register(fastifyMultipart);
  await fastifyAdapter.register(fastifyHelmet);
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.use(morgan('dev'));
  app.setGlobalPrefix('api');
  await setupSwagger(app);
  await app.listen(PORT, '0.0.0.0');
  const logger = new Logger('Bootstrap');
  logger.log(`Server is running on port: ${PORT} 🚀`);
}
bootstrap();
