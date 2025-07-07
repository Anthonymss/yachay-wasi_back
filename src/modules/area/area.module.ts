import { Module } from '@nestjs/common';
import { AreaService } from './area.service';
import { AreaController } from './area.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AreaStaff } from './entities/area-volunteer/area-staff.entity';
import { SubAreas } from './entities/area-volunteer/sub-area.entity';
import { QuestionVolunteer } from './entities/area-volunteer/question-volunteer.entity';
import { AreaAdviser } from './entities/area-beneficiary/area-adviser.entity';
import { SubAreaController } from './subarea.controller';
import { SubAreaService } from './subarea.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      AreaStaff,
      AreaAdviser,
      SubAreas,
      QuestionVolunteer,
    ]),
  ],
  controllers: [AreaController, SubAreaController],
  providers: [AreaService, SubAreaService],
  exports: [AreaService],
})
export class AreaModule { }
