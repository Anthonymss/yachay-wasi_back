import { Module } from '@nestjs/common';
import { VolunteerService } from './service/volunteer.service';
import { VolunteerController } from './controller/volunteer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Volunteers } from './entities/volunteers.entity';
import { CloudinaryModule } from 'src/shared/cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([Volunteers]), CloudinaryModule],
  controllers: [VolunteerController],
  providers: [VolunteerService],
  exports: [VolunteerService],
})
export class VolunteerModule {}
