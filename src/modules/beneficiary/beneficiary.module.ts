import { Module } from '@nestjs/common';
import { BeneficiaryService } from './service/beneficiary.service';
import { BeneficiaryController } from './controller/beneficiary.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Beneficiary } from './entities/beneficiary.entity';
import { BeneficiaryLanguage } from './entities/beneficiary-languaje.entity';
import { BeneficiaryPreferredCourses } from './entities/beneficiary-preferred-courses.entity';
import { CommunicationPreference } from './entities/communication-preference.entity';
import { Schedule } from './entities/schedule.entity';
import { AreaAdviser } from 'src/modules/area/entities/area-beneficiary/area-adviser.entity';
import { User } from 'src/modules/user/entities/user.entity';
@Module({
  controllers: [BeneficiaryController],
  providers: [BeneficiaryService],
  imports: [TypeOrmModule.forFeature([Beneficiary,BeneficiaryLanguage,BeneficiaryPreferredCourses,CommunicationPreference ,Schedule,AreaAdviser,User])],
})
export class BeneficiaryModule {}
