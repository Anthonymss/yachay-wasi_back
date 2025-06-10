import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { RolSeeder } from './seed/rol.seeder';
import { SeederService } from './seeder.service';
import { Rol } from 'src/modules/user/entities/rol.entity';
import { AreaStaff } from 'src/modules/area/entities/area-volunteer/area-staff.entity';
import { SubArea } from 'src/modules/area/entities/area-volunteer/sub-area.entity';
import { databaseConfig } from 'src/database/database.config';
import { AreaSeeder } from './seed/area.seeder';
import { AreaAsesory } from 'src/modules/area/entities/area-beneficiary/area-asesory.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(databaseConfig),
    TypeOrmModule.forFeature([Rol, AreaStaff, SubArea,AreaAsesory]),
  ],
  providers: [SeederService, RolSeeder, AreaSeeder],
})
export class SeederModule {}
