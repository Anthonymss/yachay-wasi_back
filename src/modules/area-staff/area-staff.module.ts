import { Module } from '@nestjs/common';
import { AreaStaffService } from './area-staff.service';
import { AreaStaffController } from './area-staff.controller';

@Module({
  controllers: [AreaStaffController],
  providers: [AreaStaffService],
})
export class AreaStaffModule {}
