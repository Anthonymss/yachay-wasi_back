import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { RolSeeder } from './seed/rol.seeder';
import { SeederService } from './seeder.service';
import { Rol } from 'src/modules/user/entities/rol.entity';
import { AreasStaff } from 'src/modules/area/entities/area-volunteer/areas-staff.entity';
import { SubAreas } from 'src/modules/area/entities/area-volunteer/sub-areas.entity';
import { databaseConfig } from 'src/database/database.config';
import { AreaSeeder } from './seed/area.seeder';
import { AreasAsesories } from 'src/modules/area/entities/area-beneficiary/areas-asesories.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(databaseConfig),
    TypeOrmModule.forFeature([Rol, AreasStaff, SubAreas,AreasAsesories]),
  ],
  providers: [SeederService, RolSeeder, AreaSeeder],
})
export class SeederModule {}
