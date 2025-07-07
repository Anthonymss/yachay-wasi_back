
// volunteer.module.ts
import { Module } from '@nestjs/common';
import { VolunteerService } from './service/volunteer.service';
import { VolunteerController } from './controller/volunteer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Volunteer } from './entities/volunteer.entity';
import { CloudinaryModule } from 'src/shared/cloudinary/cloudinary.module';
import { User } from 'src/modules/user/entities/user.entity';
import { MailModule } from 'src/shared/mail/mail.module';
import { QuestionVolunteer } from '../area/entities/area-volunteer/question-volunteer.entity';
import { ResponseVolunteer } from './entities/response-volunteer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Volunteer, User, QuestionVolunteer, ResponseVolunteer]),
    CloudinaryModule,
    MailModule,
  ],
  controllers: [VolunteerController],
  providers: [VolunteerService],
  exports: [VolunteerService],
})
export class VolunteerModule {}
