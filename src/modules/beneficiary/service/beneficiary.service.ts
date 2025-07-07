import { BadRequestException, ConflictException, Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateBeneficiaryDto } from '../dto/create-beneficiary.dto';
import { UpdateBeneficiaryDto } from '../dto/update-beneficiary.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Beneficiary, CallSignalIssue, Course, CoursePriorityReason, LearningLevel, ModalityStudent, Parentesco, Sex, WorkshopPreference } from '../entities/beneficiary.entity';
import { In, Repository } from 'typeorm';
import { BeneficiaryLanguage, LANGUAGES } from '../entities/beneficiary-languaje.entity';
import { BeneficiaryPreferredCourses, PREFERED_COURSES } from '../entities/beneficiary-preferred-courses.entity';
import {  CommunicationPreference } from '../entities/communication-preference.entity';
import { DAY, Schedule } from '../entities/schedule.entity';
import { AreaAdviser } from 'src/modules/area/entities/area-beneficiary/area-adviser.entity';
import { User } from 'src/modules/user/entities/user.entity';
@Injectable()
export class BeneficiaryService {
  constructor(
    @InjectRepository(Beneficiary)
    private readonly beneficiaryRepository: Repository<Beneficiary>,

    @InjectRepository(BeneficiaryLanguage)
    private readonly languageRepository: Repository<BeneficiaryLanguage>,

    @InjectRepository(BeneficiaryPreferredCourses)
    private readonly preferredCourseRepository: Repository<BeneficiaryPreferredCourses>,

    @InjectRepository(CommunicationPreference)
    private readonly communicationPreferenceRepository: Repository<CommunicationPreference>,

    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,

    @InjectRepository(AreaAdviser)
    private readonly areaAdviserRepository: Repository<AreaAdviser>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ){}

  async create(dto: CreateBeneficiaryDto) {
    const {
      beneficiaryLanguage,
      beneficiaryPreferredCourses,
      schedule,
      communicationPreferences,
      areaAdvisers,
      userId,
      ...rest
    } = dto;

    const beneficiary = this.beneficiaryRepository.create(rest);

    if (userId) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) throw new NotFoundException('Usuario no encontrado');
      beneficiary.user = user;
    }

    let saved;
    try {
      saved = await this.beneficiaryRepository.save(beneficiary);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {
        throw new ConflictException(`Ya existe un beneficiario con el mismo DNI.`);
      }
      throw new InternalServerErrorException('Error al guardar el beneficiario.');
    }
    if (beneficiaryLanguage?.length) {
      const langs = beneficiaryLanguage.map((lang) => {
        if (lang.language === LANGUAGES.OTHER) {
          if (!lang.customLanguageName?.trim()) {
            throw new BadRequestException(
              `customLanguageName es obligatorio cuando se selecciona 'Otro' en idioma.`,
            );
          }
        } else if (lang.customLanguageName) {
          throw new BadRequestException(
            `customLanguageName solo se permite si el idioma es 'Otro'.`,
          );
        }
        return this.languageRepository.create({
          language: lang.language,
          customLanguageName: lang.customLanguageName,
          beneficiary: saved,
        });
      });
    
      await this.languageRepository.save(langs);
    }
    
    if (beneficiaryPreferredCourses?.length) {
      const validatedCourses = beneficiaryPreferredCourses.map((course) => {
        if (course.name === PREFERED_COURSES.OTROS) {
          if (!course.customCourseName?.trim()) {
            throw new BadRequestException(
              `customCourseName es obligatorio cuando el curso es "Otros".`,
            );
          }
        } else if (course.customCourseName) {
          throw new BadRequestException(
            `customCourseName solo se permite cuando el curso es "Otros".`,
          );
        }
    
        return this.preferredCourseRepository.create({
          name: course.name,
          customCourseName: course.customCourseName,
          beneficiary: saved,
        });
      });
    
      await this.preferredCourseRepository.save(validatedCourses);
    }
    if (schedule?.length) {
      const schedules = this.scheduleRepository.create(
        schedule.map((s) => ({
          ...s,
          beneficiary: saved,
        })),
      );
      await this.scheduleRepository.save(schedules);
    }

    if (communicationPreferences?.length) {
      const prefs = await this.communicationPreferenceRepository.find({
        where: { id: In(communicationPreferences) },
      });
      saved.communicationPreferences = prefs;
    }

    if (areaAdvisers?.length) {
      const areas = await this.areaAdviserRepository.find({
        where: { id: In(areaAdvisers), isActive: true },
      });
    
      if (areas.length !== areaAdvisers.length) {
        throw new BadRequestException(
          'Una o más áreas seleccionadas no existen o no están activas',
        );
      }
    
      saved.areaAdvisers = areas;
    }
    await this.beneficiaryRepository.save(saved)
    return {
      id: saved.id,
      name: saved.name,
      lastName: saved.lastName,
      dni: saved.dni,
    };
    
  }
  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
  
    const [beneficiaries, total] = await this.beneficiaryRepository.findAndCount({
      skip,
      take: limit,
      relations: ['areaAdvisers', 'communicationPreferences'],
      order: { createdAt: 'DESC' },
    });
  
    const data = beneficiaries.map(({ user, deletedAt, updatedAt, ...rest }) => rest);
  
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
  async findOne(id: number) {
    const beneficiary = await this.beneficiaryRepository.findOne({
      where: { id },
      relations: ['areaAdvisers', 'communicationPreferences'],
    });
  
    if (!beneficiary) {
      throw new NotFoundException(`Beneficiario con ID ${id} no encontrado`);
    }
    const { user, deletedAt, updatedAt, ...rest } = beneficiary;

    return rest;
  }
  
  async getAllEnums() {
    const [communicationPreferences,areaAdvisers] = await Promise.all([
      this.communicationPreferenceRepository.find({ select: ['id', 'name'] }),
      this.areaAdviserRepository.find({ select: ['id', 'name'] }),
    ]);
    return {
      modalityStudent: this.mapEnum(ModalityStudent),
      sex: this.mapEnum(Sex),
      parentesco: this.mapEnum(Parentesco),
      learningLevel: this.mapEnum(LearningLevel),
      coursePriorityReason: this.mapEnum(CoursePriorityReason),
      callSignalIssue: this.mapEnum(CallSignalIssue),
      workshopPreference: this.mapEnum(WorkshopPreference),
      course: this.mapEnum(Course),
      languages: this.mapEnum(LANGUAGES),
      preferredCourses: this.mapEnum(PREFERED_COURSES),
      daysOfWeek: this.mapEnum(DAY),
      areaAdvisers: areaAdvisers,
      communicationPreferences: communicationPreferences,
    };  
  }



  //PRIVADOS
  private mapEnum(enumObj: any) {
    return Object.values(enumObj);
  }
}
