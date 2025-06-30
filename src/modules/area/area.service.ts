import { Injectable } from '@nestjs/common';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AreaStaff } from './entities/area-volunteer/area-staff.entity';
import { Repository } from 'typeorm';
import { AreaAdviser } from './entities/area-beneficiary/area-adviser.entity';
import { SubArea } from './entities/area-volunteer/sub-area.entity';
import { QuestionVolunteer } from './entities/area-volunteer/question-volunteer.entity';

@Injectable()
export class AreaService {
  constructor(
    @InjectRepository(AreaStaff)
    private readonly areaStaffRepository: Repository<AreaStaff>,
    @InjectRepository(AreaAdviser)
    private readonly areaAdviserRepository: Repository<AreaAdviser>,
    @InjectRepository(SubArea)
    private readonly subAreaRepository: Repository<SubArea>,
    @InjectRepository(QuestionVolunteer)
    private readonly questionVolunteerRepository: Repository<QuestionVolunteer>,
  ) {}

  async findAll() {
    const areaStaff = await this.areaStaffRepository.find();
    const areaAdviser = await this.areaAdviserRepository.find();
    return {
      areaStaff: areaStaff,
      areaAdviser: areaAdviser,
    };
  }
  async findAllSubAreas(idArea: number) {
    return this.subAreaRepository.find({
      where: { areaStaff: { id: idArea } },
    });
  }
  async getQuestionsByArea(areaId: number[]) {
    const questions = await this.questionVolunteerRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.Subarea', 'subArea')
      .leftJoinAndSelect('subArea.areaStaff', 'areaStaff')
      .where('areaStaff.id IN (:...areaId)', { areaId })
      .getMany();
    return questions;
  }
  //no se usa aun
  create(createAreaDto: CreateAreaDto) {
    return 'This action adds a new area';
  }

  findOne(id: number) {
    return `This action returns a #${id} area`;
  }
}
