import { Module } from '@nestjs/common';
import { AreaService } from './area.service';
import { AreaController } from './area.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AreasStaff } from './entities/area-volunteer/areas-staff.entity';
import { AreasAsesories } from './entities/area-beneficiary/areas-asesories.entity';
import { SubAreas } from './entities/area-volunteer/sub-areas.entity';
import { QuestionsVolunteers } from './entities/area-volunteer/questions-volunteers.entity';
import { QuestionsBeneficiaries } from './entities/area-beneficiary/questions-beneficiaries.entity';
import { SubAreaController } from './subarea.controller';
import { SubAreaService } from './subarea.service';
// se implementan los controladores y servicios para nestjs los reconozca
@Module({
  imports:[
    // Esencial para que los repositorios estén disponibles para inyección.
    TypeOrmModule.forFeature([AreasStaff,AreasAsesories,SubAreas, QuestionsVolunteers, QuestionsBeneficiaries, SubAreas]),
  ],
  // modulos que necesitan acceder al área service
  controllers: [AreaController, SubAreaController],
  providers: [AreaService, SubAreaService],
})
export class AreaModule {}
