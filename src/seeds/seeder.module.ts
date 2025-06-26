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
import { AdminSeeder } from './seed/admin.seeder';
import { User } from 'src/modules/user/entities/user.entity';
import { Volunteer } from 'src/modules/volunteer/entities/volunteer.entity';
import { VolunteerSeeder } from './seed/volunteer.seeder';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(databaseConfig),
    TypeOrmModule.forFeature(
      [Rol,
       AreaStaff,
       SubArea,
       AreaAsesory,
       User,
       Volunteer,
      ]),
  ],
  providers: [SeederService, RolSeeder, AreaSeeder, AdminSeeder,VolunteerSeeder],
})
export class SeederModule {}
