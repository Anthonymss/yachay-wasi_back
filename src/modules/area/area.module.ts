import { Module } from '@nestjs/common';
import { AreaService } from './service/area.service';
import { AreaController } from './controller/area.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AreaStaff } from './entities/area-volunteer/area-staff.entity';
import { SubArea } from './entities/area-volunteer/sub-area.entity';
import { QuestionVolunteer } from './entities/area-volunteer/question-volunteer.entity';
import { AreaAdviser } from './entities/area-beneficiary/area-adviser.entity';
import { SubAreaService } from './service/subarea.service';
import { SubAreaController } from './controller/subarea.controller';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      AreaStaff,
      AreaAdviser,
      SubArea,
      QuestionVolunteer,
    ]),
  ],
  controllers: [AreaController, SubAreaController],
  providers: [AreaService, SubAreaService],
  exports: [AreaService, SubAreaService],
})
export class AreaModule {}
