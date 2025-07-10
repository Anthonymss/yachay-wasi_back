
// volunteer.module.ts
import { Module } from '@nestjs/common';
import { VolunteerService } from './service/volunteer.service';
import { VolunteerController } from './controller/volunteer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Volunteer } from './entities/volunteer.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { MailModule } from 'src/shared/mail/mail.module';
import { S3Module } from 'src/shared/s3/s3.module';
import { ResponseVolunteer } from './entities/response-volunteer.entity';
import { QuestionVolunteer } from 'src/modules/area/entities/area-volunteer/question-volunteer.entity';
import { Schedule } from './entities/schedule.entity';
import { VolunteerSharedService } from './service/volunteer-shared.service';
import { VolunteerStaffService } from './service/volunteer-staff.service';
import { VolunteerAdviserService } from './service/volunteer-adviser.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([Volunteer, User, ResponseVolunteer, QuestionVolunteer, Schedule]),
    MailModule,
    S3Module,
  ],
  controllers: [VolunteerController],
  providers: [VolunteerService,VolunteerSharedService,VolunteerStaffService,VolunteerAdviserService ],
  exports: [VolunteerService],
})
export class VolunteerModule {}
