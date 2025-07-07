import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Volunteer } from '../volunteer/entities/volunteer.entity';
import { AreaStaff } from '../area/entities/area-volunteer/area-staff.entity';
import { AreaAdviser } from '../area/entities/area-beneficiary/area-adviser.entity';
import { SubAreas } from '../area/entities/area-volunteer/sub-area.entity';
import { Beneficiary } from '../beneficiary/entities/beneficiary.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Volunteer, AreaStaff, SubAreas, AreaAdviser, Beneficiary]),
  ],
  providers: [StatisticsService],
  exports: [StatisticsService],
  controllers: [StatisticsController],
})
export class StatisticsModule {}
