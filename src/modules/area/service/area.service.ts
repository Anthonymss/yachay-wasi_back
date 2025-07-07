import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AreaStaff } from '../entities/area-volunteer/area-staff.entity';
import { Not, Repository } from 'typeorm';
import { AreaAdviser } from '../entities/area-beneficiary/area-adviser.entity';
import { SubArea } from '../entities/area-volunteer/sub-area.entity';
import { QuestionVolunteer } from '../entities/area-volunteer/question-volunteer.entity';

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
    @InjectRepository(AreaAdviser)
    private readonly areaAsesoryRepository: Repository<AreaAdviser>,
  ) {}
  async findAllSubAreas(idArea: number) {
    return this.subAreaRepository.find({
      where: { areaStaff: { id: idArea } },
    });
  }
  findAllStaffAreas(): Promise<AreaStaff[]> {
    return this.areaStaffRepository.find({
      where: {
        name: Not('ASESORIES'),
      }
    })
  }
  async findAllAreas(): Promise<{ staffAreas: AreaStaff[], asesoryAreas: AreaAdviser[] }> {
    const staffAreas = await this.areaStaffRepository.find();
    const asesoryAreas = await this.areaAsesoryRepository.find();
    return { staffAreas, asesoryAreas };
  }
  async findAllAreasStaff(): Promise<{ staffAreas: AreaStaff[] }> {
    const staffAreas = await this.findAllStaffAreas();
    return { staffAreas };
  }
  async findOne(id: number): Promise<AreaStaff> {
    const area = await this.areaStaffRepository.findOne({
      where: { id: id },
      relations: ['subAreas'],
    });
    if (!area) {
      throw new NotFoundException(`Area Staff con ID ${id} no encontrada.`);
    }
    return area;
  }
  async findAllSubAreasByAreaStaffId(idArea: number): Promise<SubArea[]> {
    const subAreas = await this.subAreaRepository.find({
      where: { areaStaff: { id: idArea } },
    });
    return subAreas;
  }
  async findQuestionsBySubAreaId(idSubArea: number): Promise<QuestionVolunteer[]> {
    const questions = await this.questionVolunteerRepository.find({
      where: { SubArea: { id: idSubArea } },
    });
    if (!questions || questions.length === 0) {
      throw new NotFoundException(`No se encontraron preguntas para la subárea con ID ${idSubArea}.`);
    }
    return questions;
  }
}
