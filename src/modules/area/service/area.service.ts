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

    const allSubAreas = await this.subAreaRepository.find({
      relations: ['areaStaff'],
    });

    allSubAreas.forEach(subArea => {
      const areaId = subArea.areaStaff?.id;
      if (!areaId) {
        console.warn(`SubArea con ID ${subArea.id} no tiene areaStaff asociada.`);
        return;
      }
      if (!this.subAreasCache.has(areaId)) {
        this.subAreasCache.set(areaId, []);
      }
      this.subAreasCache.get(areaId)?.push(subArea);
    });

    const allQuestions = await this.questionVolunteerRepository.find({
      relations: ['SubArea'],
    });

    allQuestions.forEach(question => {
      const subAreaId = question.SubArea?.id;
      if (!subAreaId) {
        console.warn(`Question con ID ${question.id} no tiene SubArea asociada.`);
        return;
      }
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


  //devuelve todas las areas staff y asesrias desde sus respectivos repositorios
  async findAllAreas(): Promise<{ staffAreas: AreaStaff[]; asesoryAreas: AreaAdviser[] }> {
    const staffAreas = await this.areaStaffRepository.find();
    const asesoryAreas = await this.areaAsesoryRepository.find();
    return { staffAreas, asesoryAreas };
  }

  // devuelve todas las areas staff excluyendo la del nombre 'ASESORIES'
  async findAllAreasStaff(): Promise<{ staffAreas: AreaStaff[] }> {
    const staffAreas = await this.findAllStaffAreas();
    return { staffAreas };
  }

  // devuelve todas las subareas de un área específica
  // utiliza caché para mejorar el rendimiento
  async findAllSubAreas(idArea: number): Promise<SubArea[]> {
    const cachedSubAreas = this.subAreasCache.get(idArea);
    if (cachedSubAreas) {
      return cachedSubAreas;
    }

    const subAreas = await this.subAreaRepository.find({
      where: { areaStaff: { id: idArea } },
      relations: ['areaStaff'],
    });

    this.subAreasCache.set(idArea, subAreas);
    return subAreas;
  }

  // devuelve todas las subareas asociadas a un área staff específica
  async findAllSubAreasByAreaStaffId(idArea: number): Promise<SubArea[]> {
    return this.subAreaRepository.find({
      where: { areaStaff: { id: idArea } },
      relations: ['areaStaff'],
    });
  }

  // devuelve todas las preguntas asociadas a un subárea especifica
  async findQuestionsBySubAreaId(idSubArea: number): Promise<QuestionVolunteer[]> {
    const cachedQuestions = this.questionsCache.get(idSubArea);
    if (cachedQuestions) {
      return cachedQuestions;
    }

    const questions = await this.questionVolunteerRepository.find({
      where: { SubArea: { id: idSubArea } },
      relations: ['SubArea'],
    });

    if (!questions.length) {
      throw new NotFoundException(`No se encontraron preguntas para la subárea con ID ${idSubArea}.`);
    }

    this.questionsCache.set(idSubArea, questions);
    return questions;
  }

  // busca un área staff por ID (con sus subáreas) 
  async findOne(id: number): Promise<AreaStaff> {
    const area = await this.areaStaffRepository.findOne({
      where: { id },
      relations: ['subAreas'],
    });
    if (!area) {
      throw new NotFoundException(`Area Staff con ID ${id} no encontrada.`);
    }
    return area;
  }

  // exluye asesorias
  findAllStaffAreas(): Promise<AreaStaff[]> {
    return this.areaStaffRepository.find({
      where: { name: Not('ASESORIES') },
    });
  }
 
}
