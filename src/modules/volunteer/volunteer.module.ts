import { Module } from '@nestjs/common';
import { VolunteerService } from './service/volunteer.service';
import { VolunteerController } from './controller/volunteer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Volunteer } from './entities/volunteer.entity';
import { CloudinaryModule } from 'src/shared/cloudinary/cloudinary.module';
import { User } from 'src/modules/user/entities/user.entity';
import { MailModule } from 'src/shared/mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Volunteer, User]),
    CloudinaryModule,
    MailModule,
  ],
  controllers: [VolunteerController],
  providers: [VolunteerService],
  exports: [VolunteerService],
})
export class VolunteerModule {}
