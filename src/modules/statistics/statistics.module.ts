import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Volunteer } from '../volunteer/entities/volunteer.entity';
import { AreaStaff } from '../area/entities/area-volunteer/area-staff.entity';
import { AreaAdviser } from '../area/entities/area-beneficiary/area-adviser.entity';
import { SubArea } from '../area/entities/area-volunteer/sub-area.entity';
import { Beneficiary } from '../beneficiary/entities/beneficiary.entity';
import { Donation } from '../donation/entities/donation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Volunteer, AreaStaff, SubArea, AreaAdviser, Beneficiary, Donation]),
  ],
  providers: [StatisticsService],
  exports: [StatisticsService],
  controllers: [StatisticsController],
})
export class StatisticsModule {}
