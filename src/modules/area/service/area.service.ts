import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AreaStaff } from '../entities/area-volunteer/area-staff.entity';
import { Not, Repository } from 'typeorm';
import { AreaAdviser } from '../entities/area-beneficiary/area-adviser.entity';
import { SubArea } from '../entities/area-volunteer/sub-area.entity';
import { QuestionVolunteer } from '../entities/area-volunteer/question-volunteer.entity';

@Injectable()
export class AreaService {
  private areaStaffCache: Map<number, AreaStaff> = new Map();
  private subAreasCache: Map<number, SubArea[]> = new Map();
  private questionsCache: Map<number, QuestionVolunteer[]> = new Map();

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
  ) {
    this.initializeCache();
  }

  private async initializeCache() {
    const staffAreas = await this.areaStaffRepository.find();
    staffAreas.forEach(area => this.areaStaffCache.set(area.id, area));

    const allSubAreas = await this.subAreaRepository.find();
    allSubAreas.forEach(subArea => {
      const areaId = subArea.areaStaff.id;
      if (!this.subAreasCache.has(areaId)) {
        this.subAreasCache.set(areaId, []);
      }
      this.subAreasCache.get(areaId)?.push(subArea);
    });

    const allQuestions = await this.questionVolunteerRepository.find();
    allQuestions.forEach(question => {
      const subAreaId = question.SubArea.id;
      if (!this.questionsCache.has(subAreaId)) {
        this.questionsCache.set(subAreaId, []);
      }
      this.questionsCache.get(subAreaId)?.push(question);
    });
  }

  private async refreshCache() {
    this.areaStaffCache.clear();
    this.subAreasCache.clear();
    this.questionsCache.clear();
    await this.initializeCache();
  }
  async findAllSubAreas(idArea: number): Promise<SubArea[]> {
    const cachedSubAreas = this.subAreasCache.get(idArea);
    if (cachedSubAreas) {
      return cachedSubAreas;
    }
    
    const subAreas = await this.subAreaRepository.find({
      where: { areaStaff: { id: idArea } },
    });
    
    this.subAreasCache.set(idArea, subAreas);
    return subAreas;
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
    const cachedArea = this.areaStaffCache.get(id);
    if (cachedArea) {
      return cachedArea;
    }
    
    const area = await this.areaStaffRepository.findOne({
      where: { id: id },
      relations: ['subAreas'],
    });
    if (!area) {
      throw new NotFoundException(`Area Staff con ID ${id} no encontrada.`);
    }
    
    this.areaStaffCache.set(id, area);
    return area;
  }
  async findAllSubAreasByAreaStaffId(idArea: number): Promise<SubArea[]> {
    const subAreas = await this.subAreaRepository.find({
      where: { areaStaff: { id: idArea } },
    });
    return subAreas;
  }
  async findQuestionsBySubAreaId(idSubArea: number): Promise<QuestionVolunteer[]> {
    const cachedQuestions = this.questionsCache.get(idSubArea);
    if (cachedQuestions) {
      return cachedQuestions;
    }
    
    const questions = await this.questionVolunteerRepository.find({
      where: { SubArea: { id: idSubArea } },
    });
    
    if (!questions || questions.length === 0) {
      throw new NotFoundException(`No se encontraron preguntas para la subárea con ID ${idSubArea}.`);
    }
    
    this.questionsCache.set(idSubArea, questions);
    return questions;
  }
}
