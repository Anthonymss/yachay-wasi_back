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
import { AreaAdviser } from 'src/modules/area/entities/area-beneficiary/area-adviser.entity';
import { AdminSeeder } from './seed/admin.seeder';
import { User } from 'src/modules/user/entities/user.entity';
import { Volunteer } from 'src/modules/volunteer/entities/volunteer.entity';
import { VolunteerSeeder } from './seed/volunteer.seeder';
import { Schedule } from 'src/modules/volunteer/entities/schedule.entity';
import { CommunicationPreference } from 'src/modules/beneficiary/entities/communication-preference.entity';
import { ComunicationPreferenceSeeder } from './seed/comunication-preference.seeder';
import { ResponseVolunteer } from 'src/modules/volunteer/entities/response-volunteer.entity';
import { QuestionVolunteer } from 'src/modules/area/entities/area-volunteer/question-volunteer.entity';
import { BeneficiarySeeder } from './seed/beneficiary.seeder';
import { Beneficiary } from 'src/modules/beneficiary/entities/beneficiary.entity';
import { BeneficiaryLanguage } from 'src/modules/beneficiary/entities/beneficiary-languaje.entity';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(databaseConfig),
    TypeOrmModule.forFeature([
      Rol,
      AreaStaff,
      SubArea,
      AreaAdviser,
      User,
      Volunteer,
      Schedule,
      CommunicationPreference,
      ResponseVolunteer,
      QuestionVolunteer,
      Beneficiary,
      BeneficiaryLanguage,
    ]),
  ],
  providers: [
    SeederService,
    BeneficiarySeeder,
    RolSeeder,
    AreaSeeder,
    AdminSeeder,
    VolunteerSeeder,
    ComunicationPreferenceSeeder,
  ],
})
export class SeederModule {}
