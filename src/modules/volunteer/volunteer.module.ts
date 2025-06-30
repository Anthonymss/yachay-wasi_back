import { Module } from '@nestjs/common';
import { VolunteerService } from './service/volunteer.service';
import { VolunteerController } from './controller/volunteer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Volunteers } from './entities/volunteers.entity';
import { CloudinaryModule } from 'src/shared/cloudinary/cloudinary.module';
import { Schedule } from './entities/schedule.entity';
import { ResponsesVolunteers } from './entities/responses-volunteers.entity';
import { SubAreas } from '../area/entities/area-volunteer/sub-areas.entity';
import { QuestionsVolunteers } from '../area/entities/area-volunteer/questions-volunteers.entity';
import { ApplicationController } from './controller/application.controller';
import { ApplicationService } from './service/application.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Volunteers,
      Schedule,
      ResponsesVolunteers,
      SubAreas,
      QuestionsVolunteers
    ]), 
      CloudinaryModule],
  controllers: [VolunteerController, ApplicationController],
  providers: [VolunteerService, ApplicationService],
  exports: [VolunteerService],
})
export class VolunteerModule {}
