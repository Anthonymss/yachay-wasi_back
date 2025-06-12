import { Module } from '@nestjs/common';
import { AreaService } from './area.service';
import { AreaController } from './area.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AreasStaff } from './entities/area-volunteer/areas-staff.entity';
import { AreasAsesories } from './entities/area-beneficiary/areas-asesories.entity';
import { SubAreas } from './entities/area-volunteer/sub-areas.entity';
import { QuestionsVolunteers } from './entities/area-volunteer/questions-volunteers.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([AreasStaff,AreasAsesories,SubAreas, QuestionsVolunteers]),
  ],
  controllers: [AreaController],
  providers: [AreaService],
})
export class AreaModule {}
