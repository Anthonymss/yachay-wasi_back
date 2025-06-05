import { Module } from '@nestjs/common';
import { VolunteerService } from './service/volunteer.service';
import { VolunteerController } from './controller/volunteer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Volunteer } from './entities/volunteer.entity';
import { CloudinaryModule } from 'src/shared/cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([Volunteer]), CloudinaryModule],
  controllers: [VolunteerController],
  providers: [VolunteerService],
  exports: [VolunteerService],
})
export class VolunteerModule {}
