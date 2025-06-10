import { Injectable } from '@nestjs/common';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AreaStaff } from './entities/area-volunteer/area-staff.entity';
import { Repository } from 'typeorm';
import { AreaAsesory } from './entities/area-beneficiary/area-asesory.entity';
import { SubArea } from './entities/area-volunteer/sub-area.entity';

@Injectable()
export class AreaService {
  
  constructor
  (
    @InjectRepository(AreaStaff)
    private readonly areaStaffRepository:Repository<AreaStaff>,
    @InjectRepository(AreaAsesory)
    private readonly areaAsesoryRepository:Repository<AreaAsesory>,
    @InjectRepository(SubArea)
    private readonly subAreaRepository:Repository<SubArea>,
  )
  {}

  findAll() {
    return this.areaStaffRepository.find();//agregar area Asesory
  }
async findAllSubAreas(idArea: number) {
  return this.subAreaRepository.find({
    where: { areaStaff: { id: idArea } },
  });
}

  create(createAreaDto: CreateAreaDto) {
    return 'This action adds a new area';
  }



  findOne(id: number) {
    return `This action returns a #${id} area`;
  }
}
