import { Module } from '@nestjs/common';
import { AreaService } from './area.service';
import { AreaController } from './area.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AreasStaff } from './entities/area-volunteer/areas-staff.entity';
import { AreasAsesories } from './entities/area-beneficiary/areas-asesories.entity';
import { SubAreas } from './entities/area-volunteer/sub-areas.entity';
import { QuestionsVolunteers } from './entities/area-volunteer/questions-volunteers.entity';
import { QuestionsBeneficiaries } from './entities/area-beneficiary/questions-beneficiaries.entity';

@Module({
  imports:[
    // Esencial para que los repositorios estén disponibles para inyección.
    TypeOrmModule.forFeature([AreasStaff,AreasAsesories,SubAreas, QuestionsVolunteers, QuestionsBeneficiaries]),
  ],
  // modulos que necesitan acceder al área service
  controllers: [AreaController],
  providers: [AreaService],
})
export class AreaModule {}
