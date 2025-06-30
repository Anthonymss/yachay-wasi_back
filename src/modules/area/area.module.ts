import { Module } from '@nestjs/common';
import { AreaService } from './area.service';
import { AreaController } from './area.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AreaStaff } from './entities/area-volunteer/area-staff.entity';
import { SubArea } from './entities/area-volunteer/sub-area.entity';
import { QuestionVolunteer } from './entities/area-volunteer/question-volunteer.entity';
import { AreaAdviser } from './entities/area-beneficiary/area-adviser.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      AreaStaff,
      AreaAdviser,
      SubArea,
      QuestionVolunteer,
    ]),
  ],
  controllers: [AreaController],
  providers: [AreaService],
  exports: [AreaService],
})
export class AreaModule {}
