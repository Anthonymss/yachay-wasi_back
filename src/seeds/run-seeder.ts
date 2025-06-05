import { NestFactory } from '@nestjs/core';
import { SeederService } from './seeder.service';
import { SeederModule } from './seeder.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeederModule);
  const seeder = app.get(SeederService);

  await seeder.seed();
  await app.close();
}

bootstrap();
