import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AreasStaff } from './entities/area-volunteer/areas-staff.entity';
import { Repository } from 'typeorm';
import { AreasAsesories } from './entities/area-beneficiary/areas-asesories.entity';
import { SubAreas } from './entities/area-volunteer/sub-areas.entity';
import { QuestionsVolunteers } from './entities/area-volunteer/questions-volunteers.entity';
import { QuestionsBeneficiaries } from '../area/entities/area-beneficiary/questions-beneficiaries.entity';
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
      private readonly questionsVolunteerRepository: Repository<QuestionsVolunteers>,
      @InjectRepository(QuestionsBeneficiaries)
      private readonly questionBeneficiaryRepository: Repository<QuestionsBeneficiaries>,
    ) { }

  // obtener áreas de staff
  findAllStaff() {
    return this.areaStaffRepository.find();//agregar area Asesory
  }
  // obtener areas de asesorias
  findAllAsesories() {
    return this.areaAsesoryRepository.find();
  }

  /**
   * Obtiene todas las áreas de Staff y Asesoría.
   * Puedes usar esta función para cargar todas las áreas generales.
   */
  async findAllAreas(): Promise<{ staffAreas: AreasStaff[], asesoryAreas: AreasAsesories[] }> {
    const staffAreas = await this.areaStaffRepository.find();
    const asesoryAreas = await this.areaAsesoryRepository.find();
    return { staffAreas, asesoryAreas };
  }

  /**
   * Obtiene una sola área de Staff por ID, incluyendo sus subáreas.
   * Esto es útil si quieres mostrar los detalles de un área específica con sus subáreas.
   */
  async findOneAreaStaffWithSubAreas(idArea: number): Promise<AreasStaff> {
    const area = await this.areaStaffRepository.findOne({
      where: { id: idArea },
      relations: ['subAreas'], // Asegúrate de que 'subAreas' sea el nombre de la relación en AreasStaff
    });
    if (!area) {
      throw new NotFoundException(`Area Staff con ID ${idArea} no encontrada.`);
    }
    return area;
  }

  /**
   * Obtiene todas las subáreas asociadas a una Área Staff específica.
   * @param idArea El ID del Área Staff.
   */
  async findAllSubAreasByAreaStaffId(idArea: number): Promise<SubAreas[]> {
    const subAreas = await this.subAreaRepository.find({
      where: { areaStaff: { id: idArea } },
      // relations: ['questionsVolunteers'], // Puedes incluir las preguntas de cada subárea aquí si las necesitas
    });
    return subAreas;
  }

  /**
   * Obtiene todas las preguntas asociadas a una subárea específica.
   * @param idSubArea El ID de la SubÁrea.
   */
  async findQuestionsBySubAreaId(idSubArea: number): Promise<QuestionsVolunteers[]> {
    const questions = await this.questionsVolunteerRepository.find({
      where: { SubArea: { id: idSubArea } }, // Asume que 'subArea' es la relación en QuestionsVolunteers
    });
    if (!questions || questions.length === 0) {
      // Opcional: Lanzar una excepción si no hay preguntas, o simplemente retornar un array vacío.
      // throw new NotFoundException(`No se encontraron preguntas para la subárea con ID ${idSubArea}.`);
    }
    return questions;
  }

  // obtener preguntas por id de area de asesoria
  async findQuestionsByAreaId(idArea: number): Promise<QuestionsBeneficiaries[]> {
    const questions = await this.questionBeneficiaryRepository.find({
      where: { areaAsesory: { id: idArea}},
    });
    if(!questions || questions.length === 0){
      throw new NotFoundException(`No se encontraron preguntas`);
    }
    return questions
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

  /*async getQuestionsByArea(areaId: number[]) {
    const questions = await this.questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.Subarea', 'subArea')
      .leftJoinAndSelect('subArea.areaStaff', 'areaStaff')
      .where('areaStaff.id IN (:...areaId)', { areaId })
      .getMany();
    return questions;
  }*/
}
