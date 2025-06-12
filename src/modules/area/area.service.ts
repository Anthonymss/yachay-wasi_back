import { Injectable } from '@nestjs/common';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AreasStaff } from './entities/area-volunteer/areas-staff.entity';
import { Repository } from 'typeorm';
import { AreasAsesories } from './entities/area-beneficiary/areas-asesories.entity';
import { SubAreas } from './entities/area-volunteer/sub-areas.entity';
import { QuestionsVolunteers } from './entities/area-volunteer/questions-volunteers.entity';

// IMPLEMENTAMOS EL SERVICIO
@Injectable()
export class AreaService {

  constructor
    (
      @InjectRepository(AreasStaff)
      private readonly areaStaffRepository: Repository<AreasStaff>,
      @InjectRepository(AreasAsesories)
      private readonly areaAsesoryRepository: Repository<AreasAsesories>,
      @InjectRepository(SubAreas)
      private readonly subAreaRepository: Repository<SubAreas>,
      @InjectRepository(QuestionsVolunteers)
      private readonly questionRepository: Repository<QuestionsVolunteers>
    ) { }

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

  async getQuestionsByArea(areaId: number[]) {
    const questions = await this.questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.Subarea', 'subArea')
      .leftJoinAndSelect('subArea.areaStaff', 'areaStaff')
      .where('areaStaff.id IN (:...areaId)', { areaId })
      .getMany();
    return questions;
  }
}
