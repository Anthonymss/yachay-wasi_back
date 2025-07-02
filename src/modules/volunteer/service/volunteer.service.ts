import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVolunteerStaffDto } from '../dto/create-volunteer-staff.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  InfoSource,
  ProgramsUniversity,
  QuechuaLevel,
  SchoolGrades,
  TYPE_IDENTIFICATION,
  TYPE_VOLUNTEER,
  Volunteer,
} from '../entities/volunteer.entity';
import { Repository } from 'typeorm';
import { CloudinaryService } from 'src/shared/cloudinary/cloudinary.service';
import { CreateVolunteerADdviserDto } from '../dto/create-volunteer-Adviser.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { VolunteerResponseDto } from '../dto/volunteer-response.dto';
import { DAY, Schedule } from '../entities/schedule.entity';
import { User } from 'src/modules/user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/shared/mail/mail.service';
@Injectable()
export class VolunteerService {
  constructor(
    @InjectRepository(Volunteer)
    private readonly volunteerRepository: Repository<Volunteer>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly mailService: MailService,
  ) {}

  async createVolunteerStaff(
    dto: CreateVolunteerStaffDto,
    file: Express.Multer.File,
  ): Promise<Volunteer> {
    await this.validateData(dto.email, TYPE_VOLUNTEER.STAFF, file);
    const cvUrl = await this.cloudinaryService.uploadFile(file);

    const volunteer = this.volunteerRepository.create({
      ...dto,
      cvUrl,
      typeVolunteer: TYPE_VOLUNTEER.STAFF,
      datePostulation: new Date(),
    });

    const saved = await this.volunteerRepository.save(volunteer);
    await this.sendConfirmationEmail(saved);
    return saved;
  }

  async createVolunteerAdviser(
    dto: CreateVolunteerADdviserDto,
    file: Express.Multer.File,
    video: Express.Multer.File,
  ): Promise<Volunteer> {
    if (!video.mimetype.startsWith('video/')) {
      throw new BadRequestException('El archivo de video debe ser válido');
    }

    await this.validateData(dto.email, TYPE_VOLUNTEER.ADVISER, file);
    const [cvUrl, videoUrl] = await Promise.all([
      this.cloudinaryService.uploadFile(file),
      this.cloudinaryService.uploadFile(video),
    ]);

    const volunteer = this.volunteerRepository.create({
      ...dto,
      cvUrl,
      videoUrl,
      typeVolunteer: TYPE_VOLUNTEER.ADVISER,
      datePostulation: new Date(),
      schedules: [],
    });

    const saved = await this.volunteerRepository.save(volunteer);
    await this.sendConfirmationEmail(saved);

    const schedules = dto.schedule.map((s) => ({
      ...s,
      volunteer: saved,
    }));

    await this.volunteerRepository.manager
      .getRepository(Schedule)
      .save(schedules);

    return saved;
  }

  async findAll(type: TYPE_VOLUNTEER, page = 1, limit = 10) {
    const [volunteers, total] = await this.volunteerRepository.findAndCount({
      where: { typeVolunteer: type },
      relations: ['schedules'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    const data = volunteers.map((v) =>
      plainToInstance(VolunteerResponseDto, v),
    );

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async approveVolunteer(id: number): Promise<{ message: string }> {
    const volunteer = await this.volunteerRepository.findOne({ where: { id } });

    if (!volunteer) throw new NotFoundException('Voluntario no encontrado');
    if (volunteer.isVoluntary)
      throw new BadRequestException('El voluntario ya es un usuario');

    const roleId = volunteer.typeVolunteer === TYPE_VOLUNTEER.STAFF ? 1 : 2;

    try {
      await this.userRepository.manager.transaction(async (manager) => {
        const newUser = manager.create(User, {
          name: volunteer.name,
          lastName: volunteer.lastName,
          email: volunteer.email,
          password: await bcrypt.hash(volunteer.numIdentification, 10),
          rol: { id: roleId },
          phoneNumber: volunteer.phoneNumber,
          subArea: { id: volunteer.idPostulationArea },
        });

        await manager.save(newUser);

        volunteer.isVoluntary = true;
        if (volunteer.typeVolunteer === TYPE_VOLUNTEER.ADVISER) {
          await manager.save(volunteer);
        }

        await this.mailService.sendTemplate(
          volunteer.email,
          'welcome',
          { subject: 'Bienvenido a Yachay Wasi' },
          {
            name: volunteer.name,
            role: volunteer.typeVolunteer,
          },
        );
      });

      return { message: 'Voluntario aprobado correctamente' };
    } catch (error) {
      throw new Error(
        `Error al aprobar voluntario: ${
          error instanceof Error ? error.message : 'desconocido'
        }`,
      );
    }
  }

  async prepareAdviserDto(body: any): Promise<CreateVolunteerADdviserDto> {
    let parsedSchedule: any;
    try {
      parsedSchedule = JSON.parse(body.schedule);
    } catch {
      throw new BadRequestException('El formato de schedule no es válido.');
    }

    const dto = plainToInstance(CreateVolunteerADdviserDto, {
      ...body,
      wasVoluntary: body.wasVoluntary === 'true',
      schedule: parsedSchedule,
    });

    const errors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) throw new BadRequestException(errors);
    return dto;
  }

  async getVolunteerEnums() {
    const extractEnum = (e: any) =>
      Object.values(e).filter((v) => typeof v === 'string');

    return {
      typeIdentification: extractEnum(TYPE_IDENTIFICATION),
      infoSource: extractEnum(InfoSource),
      quechuaLevel: extractEnum(QuechuaLevel),
      schoolGrades: extractEnum(SchoolGrades),
      programsUniversity: extractEnum(ProgramsUniversity),
      dayOfWeek: extractEnum(DAY),
    };
  }
  async getProfileVolunteer(id: number): Promise<VolunteerResponseDto>{
    const volunteer = await this.volunteerRepository.findOne({
      where: { id },
    });
    return plainToInstance(VolunteerResponseDto, volunteer);
  } 

  //priv
  private async validateData(
    email: string,
    type: TYPE_VOLUNTEER,
    file: Express.Multer.File,
  ) {
    if (!file)
      throw new BadRequestException('Se necesita subir un archivo PDF');
    if (file.mimetype !== 'application/pdf')
      throw new BadRequestException('El archivo debe ser un PDF');

    const exists = await this.volunteerRepository.findOne({
      where: { email, typeVolunteer: type },
    });

    if (exists) {
      throw new BadRequestException(
        'Ya existe un voluntario con este correo y tipo de voluntariado',
      );
    }
  }

  private async sendConfirmationEmail(volunteer: Volunteer) {
    await this.mailService.sendTemplate(
      volunteer.email,
      'volunteer-registration',
      { subject: 'Confirmación de Registro - Voluntariado Yachay Wasi' },
      {
        name: volunteer.name,
        lastName: volunteer.lastName,
        email: volunteer.email,
        typeVolunteer: volunteer.typeVolunteer,
        datePostulation: volunteer.datePostulation.toLocaleDateString(),
      },
    );
  }
}
