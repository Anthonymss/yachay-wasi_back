import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateVolunteerStaffDto } from '../dto/create-volunteer-staff.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TYPE_VOLUNTEER, Volunteer } from '../entities/volunteer.entity';
import { Repository } from 'typeorm';
import { CloudinaryService } from 'src/shared/cloudinary/cloudinary.service';
import { CreateVolunteerADdviserDto } from '../dto/create-volunteer-Adviser.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

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
    console.log('wasVoluntary? ' + dto.wasVoluntary);
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
    console.log('.');
    await this.validateData(dto.email, TYPE_VOLUNTEER.ADVISER, file);
    console.log('wasVoluntary? ' + dto.wasVoluntary);
    const urlCv = await this.cloudinaryService.uploadFile(file);
    const urlVideo = await this.cloudinaryService.uploadFile(video);
    const volunteer = this.volunteerRepository.create({
      ...dto,
      cvUrl: urlCv,
      videoUrl: urlVideo,
      typeVolunteer: TYPE_VOLUNTEER.ADVISER,
      datePostulation: new Date(),
    });
    return this.volunteerRepository.save(volunteer);
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
