import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import * as morgan from 'morgan';
import { AppModule } from './app.module';
import { corsConfig } from './config/cors.config';
import cors from '@fastify/cors';
import { setupSwagger } from './config/swagger/swagger.config';

async function bootstrap() {
  const PORT = process.env.PORT || 3000;
  const fastifyAdapter = new FastifyAdapter();
  await fastifyAdapter.register(cors, corsConfig);
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
  );
  app.use(morgan('dev'));
  app.setGlobalPrefix('api');
  await setupSwagger(app);
  await app.listen(PORT, '0.0.0.0');
  const logger = new Logger('Bootstrap');
  logger.log(`Server is running on port: ${PORT} 🚀`);
}
bootstrap();
