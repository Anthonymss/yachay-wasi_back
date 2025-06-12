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
import multipart from '@fastify/multipart';
import fastifyHelmet from '@fastify/helmet';
import fastifyStatic from '@fastify/static';
import { join } from 'path';

async function bootstrap() {
  const PORT = process.env.PORT || 3000;
  const fastifyAdapter = new FastifyAdapter();

  await fastifyAdapter.register(cors, corsConfig);
  await fastifyAdapter.register(fastifyHelmet);

  await fastifyAdapter.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024,
      files: 1,
      fields: 20,
    },
  });

  await fastifyAdapter.register(fastifyStatic, {
    root: join(__dirname, '..'),
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
  );

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  app.use(morgan('dev'));
  app.setGlobalPrefix('api');

  await setupSwagger(app);

  await app.listen(PORT, '0.0.0.0');
  const logger = new Logger('Bootstrap');
  logger.log(`Server is running on port: ${PORT}  🚀`);
}
bootstrap();
