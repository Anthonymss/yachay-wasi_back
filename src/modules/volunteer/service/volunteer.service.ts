import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateVolunteerStaffDto } from '../dto/create-volunteer-staff.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TYPE_VOLUNTEER, Volunteer } from '../entities/volunteer.entity';
import { Repository } from 'typeorm';
import { CloudinaryService } from 'src/shared/cloudinary/cloudinary.service';
import { CreateVolunteerADdviserDto } from '../dto/create-volunteer-Adviser.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { VolunteerResponseDto } from '../dto/volunteer-response.dto';
import { Schedule } from '../entities/schedule.entity';

@Injectable()
export class VolunteerService {
  constructor(
    @InjectRepository(Volunteer)
    private readonly volunteerRepository: Repository<Volunteer>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async createVolunteerStaff(
    dto: CreateVolunteerStaffDto,
    file: Express.Multer.File,
  ): Promise<Volunteer> {
    await this.validateData(dto.email, TYPE_VOLUNTEER.STAFF, file);
    const urlCv = await this.cloudinaryService.uploadFile(file);
    const volunteer = this.volunteerRepository.create({
      ...dto,
      cvUrl: urlCv,
      typeVolunteer: TYPE_VOLUNTEER.STAFF,
      datePostulation: new Date(),
    });
    return this.volunteerRepository.save(volunteer);
  }
  async createVolunteerAdviser(
    dto: CreateVolunteerADdviserDto,
    file: Express.Multer.File,
    video: Express.Multer.File,
  ): Promise<Volunteer> {
    if (!video.mimetype.startsWith('video/')) {
      throw new BadRequestException(
        'El archivo de video debe ser un formato de video válido',
      );
    }
    await this.validateData(dto.email, TYPE_VOLUNTEER.ADVISER, file);
    const urlCv = await this.cloudinaryService.uploadFile(file);
    const urlVideo = await this.cloudinaryService.uploadFile(video);
    const volunteer = this.volunteerRepository.create({
      ...dto,
      cvUrl: urlCv,
      videoUrl: urlVideo,
      typeVolunteer: TYPE_VOLUNTEER.ADVISER,
      datePostulation: new Date(),
      schedules: [],
    });
    const savedVolunteer = await this.volunteerRepository.save(volunteer);
    const scheduleEntities = dto.schedule.map((s) => ({
      ...s,
      volunteer: savedVolunteer,
    }));

    await this.volunteerRepository.manager
      .getRepository(Schedule)
      .save(scheduleEntities);
    return savedVolunteer;
  }

  async findAll(type: TYPE_VOLUNTEER, page = 1, limit = 10) {
    const [volunteers, total] = await this.volunteerRepository.findAndCount({
      where: { typeVolunteer: type },
      relations: ['schedules'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    const data: VolunteerResponseDto[] = volunteers.map((volunteer) => {
      return {
        id: volunteer.id,
        name: volunteer.name,
        lastName: volunteer.lastName,
        email: volunteer.email,
        birthDate: volunteer.birthDate,
        phoneNumber: volunteer.phoneNumber,
        typeVolunteer: volunteer.typeVolunteer,
        typeIdentification: volunteer.typeIdentification,
        numIdentification: volunteer.numIdentification,
        wasVoluntary: volunteer.wasVoluntary,
        cvUrl: volunteer.cvUrl,
        videoUrl: volunteer.videoUrl ?? undefined,
        datePostulation: volunteer.datePostulation,
        volunteerMotivation: volunteer.volunteerMotivation,
        howDidYouFindUs: volunteer.howDidYouFindUs,
        schedules: volunteer.schedules?.length ? volunteer.schedules : [],
        advisoryCapacity: volunteer.advisoryCapacity ?? undefined,
        namePostulationArea: volunteer.namePostulationArea ?? '',
      };
    });

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  //privates
  async validateData(
    email: string,
    typeVolunteer: TYPE_VOLUNTEER,
    file: Express.Multer.File,
  ) {
    if (!file)
      throw new BadRequestException('Se necesita subir un archivo pdf');
    if (file.mimetype !== 'application/pdf')
      throw new BadRequestException('El archivo debe ser un PDF');

    const existingVolunteer = await this.volunteerRepository.findOne({
      where: {
        email: email,
        typeVolunteer: typeVolunteer,
      },
    });

    if (existingVolunteer)
      throw new BadRequestException(
        'Ya existe un voluntario con este correo y tipo de voluntariado',
      );
  }

  //other
  async prepareAdviserDto(body: any): Promise<CreateVolunteerADdviserDto> {
    let parsedSchedule;
    try {
      parsedSchedule = JSON.parse(body.schedule);
    } catch (error) {
      throw new BadRequestException('El formato de schedule no es válido.');
    }

    const dto = plainToInstance(CreateVolunteerADdviserDto, {
      ...body,
      wasVoluntary: body.wasVoluntary === 'true',
      schedule: parsedSchedule,
    });

    const validationErrors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (validationErrors.length > 0) {
      throw new BadRequestException(validationErrors);
    }

    return dto;
  }
}
