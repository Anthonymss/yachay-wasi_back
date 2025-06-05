import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AreaStaff } from 'src/modules/area/entities/area-volunteer/area-staff.entity';
import { SubArea } from 'src/modules/area/entities/area-volunteer/sub-area.entity';
@Injectable()
export class AreaSeeder {
  private readonly log = new Logger('Seeder');

  constructor(
    @InjectRepository(AreaStaff)
    private readonly areaStaffRepository: Repository<AreaStaff>,
    @InjectRepository(SubArea)
    private readonly subAreaRepository: Repository<SubArea>,
  ) {}

  async seed() {
    const area1 = this.areaStaffRepository.create({
      name: 'Asesoria',
      description: '1',
      isActive: true,
    });
    const area2 = this.areaStaffRepository.create({
      name: 'Staff',
      description: '2',
      isActive: true,
    });

    await this.areaStaffRepository.save([area1, area2]);

    const subArea1 = this.subAreaRepository.create({
      name: 'sub_Asesoria',
      description: '1',
      isActive: true,
      areaStaff: area1,
    });

    const subArea2 = this.subAreaRepository.create({
      name: 'sub2_Asesoria',
      description: '1',
      isActive: true,
      areaStaff: area2,
    });

    await this.subAreaRepository.save([subArea1, subArea2]);

    this.log.log('Seeding completado correctamente');
  }
}
