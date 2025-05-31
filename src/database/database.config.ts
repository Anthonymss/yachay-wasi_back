import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import { DataSource } from 'typeorm';

export const databaseConfig = {
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => (
      console.log('Database config loaded'),
    console.log(`DB_HOST: ${configService.get<string>('DB_HOST')}`),
    console.log(`DB_PORT: ${configService.get<number>('DB_PORT')}`),
    console.log(`DB_USERNAME: ${configService.get<string>('DB_USERNAME')}`),
    console.log(`DB_PASSWORD: ${configService.get<string>('DB_PASSWORD')}`),
    console.log(`DB_DATABASE: ${configService.get<string>('DB_DATABASE')}`),
    console.log(`DB_SYNC: ${configService.get<boolean>('DB_SYNC')}`),
    console.log(`DB_LOGGING: ${process.env.DB_LOGGING}`),
    {
    type: 'mysql',
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: configService.get<number>('DB_PORT', 3306),
    username: configService.get<string>('DB_USERNAME', 'root'),
    password: configService.get<string>('DB_PASSWORD', ''),
    database: configService.get<string>('DB_DATABASE', 'yw_db'),
    entities: [path.join(__dirname, '../**/*.entity{.ts,.js}')],
    synchronize: configService.get<boolean>('DB_SYNC', false),
    migrations: [path.resolve(__dirname, 'migrations', '*{.ts,.js}')],
    logging: process.env.DB_LOGGING === 'true',
  }),
  inject: [ConfigService],
};
//seeding and migrations
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'yw_db',
  entities: [path.join(__dirname, '../**/*.entity{.ts,.js}')],
  synchronize: false,
  migrations: [path.resolve(__dirname, 'migrations', '*{.ts,.js}')],
  logging: process.env.DB_LOGGING === 'true',
});
