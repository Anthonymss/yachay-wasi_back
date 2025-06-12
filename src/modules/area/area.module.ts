import { Module } from '@nestjs/common';
import { AreaService } from './area.service';
import { AreaController } from './area.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AreaStaff } from './entities/area-volunteer/area-staff.entity';
import { AreaAsesory } from './entities/area-beneficiary/area-asesory.entity';
import { SubArea } from './entities/area-volunteer/sub-area.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AreaStaff, AreaAsesory, SubArea])],
  controllers: [AreaController],
  providers: [AreaService],
})
export class AreaModule {}
