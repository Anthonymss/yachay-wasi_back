import {
    BadRequestException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import {
    Volunteer,
    TYPE_VOLUNTEER,
    StatusVolunteer,
    TYPE_IDENTIFICATION,
    InfoSource,
    SchoolGrades,
    QuechuaLevel,
    ProgramsUniversity,
  } from '../entities/volunteer.entity';
  import { S3Service } from 'src/shared/s3/S3.service';
  import { MailService } from 'src/shared/mail/mail.service';
  import { plainToInstance } from 'class-transformer';
  import { validate } from 'class-validator';
  import { UpdateVolunteerAdviserDto, UpdateVolunteerStaffDto } from '../dto/update-volunteer.dto';
import { VolunteerResponseDto } from '../dto/volunteer-response.dto';
import { CreateVolunteerAdviserDto } from '../dto/create-volunteer-Adviser.dto';
import { User } from 'src/modules/user/entities/user.entity';
import * as bcrypt from 'bcrypt';  
import { DAY } from '../entities/schedule.entity';
  @Injectable()
  export class VolunteerSharedService {
    constructor(
      @InjectRepository(Volunteer)
      private readonly volunteerRepository: Repository<Volunteer>,
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
      private readonly s3Service: S3Service,
      private readonly mailService: MailService,
    ) {}
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
        if (volunteer.isVoluntary&&volunteer.statusVolunteer===StatusVolunteer.APPROVED)
          throw new BadRequestException('El voluntario ya es un usuario, y esta aprobado');
        const roleId = volunteer.typeVolunteer === TYPE_VOLUNTEER.STAFF ? 4 : 2;
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
            if (volunteer.typeVolunteer === TYPE_VOLUNTEER.STAFF) {
              await manager.save(newUser);
            }
    
            volunteer.isVoluntary = true;
            volunteer.statusVolunteer = StatusVolunteer.APPROVED;
    
            await manager.save(volunteer);
    
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
          throw new BadRequestException (
            `Error al aprobar voluntario: ${
              error instanceof Error ? error.message : 'desconocido'
            }`,
          );
        }
      }
      async rejectVolunteer(id: number): Promise<{ message: string }> {
        const volunteer = await this.volunteerRepository.findOne({ where: { id } });
        if (!volunteer) throw new NotFoundException('Voluntario no encontrado');
        if(volunteer.statusVolunteer===StatusVolunteer.REJECTED)
          throw new BadRequestException('El voluntario ya fue rechazado');
      
        volunteer.statusVolunteer = StatusVolunteer.REJECTED;
        volunteer.isVoluntary = false;
        await this.volunteerRepository.save(volunteer);
    
        await this.mailService.sendTemplate(
          volunteer.email,
          'reject-volunteer',
          { subject: 'Solicitud de Voluntariado - Yachay Wasi' },
          { name: volunteer.name },
        );
    
        return { message: 'Voluntario rechazado correctamente' };
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
      async softDeleteVolunteer(id: number): Promise<{ message: string }> {
        const volunteer = await this.volunteerRepository.findOne({ where: { id } });
        if (!volunteer) throw new NotFoundException('Voluntario no encontrado');
      
        await this.volunteerRepository.softRemove(volunteer);
        return { message: 'Voluntario eliminado correctamente' };
      }

    //reutilizables :)
    public async validateData(
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
    
      public async sendConfirmationEmail(volunteer: Volunteer) {
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
      public async mapAndValidateStaffDto(body: any): Promise<UpdateVolunteerStaffDto> {
        const dto = plainToInstance(UpdateVolunteerStaffDto, {
          ...body,
          wasVoluntary: body.wasVoluntary === 'true',
          idPostulationArea: body.idPostulationArea ? Number(body.idPostulationArea) : undefined,
        });
      
        const errors = await validate(dto);
        if (errors.length > 0) throw new BadRequestException(errors);
      
        return dto;
      }
      
      public async mapAndValidateAdviserDto(body: any): Promise<UpdateVolunteerAdviserDto> {
        let scheduleParsed, responsesParsed;
        try {
          scheduleParsed = body.schedule ? JSON.parse(body.schedule) : undefined;
          responsesParsed = body.responses ? JSON.parse(body.responses) : undefined;
        } catch {
          throw new BadRequestException('schedule o responses mal formateados');
        }
      
        const dto = plainToInstance(UpdateVolunteerAdviserDto, {
          ...body,
          wasVoluntary: body.wasVoluntary === 'true',
          experience: body.experience === 'true',
          idPostulationArea: body.idPostulationArea ? Number(body.idPostulationArea) : undefined,
          schedule: scheduleParsed,
          responses: responsesParsed,
        });
      
        const errors = await validate(dto);
        if (errors.length > 0) throw new BadRequestException(errors);
      
        return dto;
      }
        async prepareAdviserDto(body: any): Promise<CreateVolunteerAdviserDto> {
          let parsedSchedule: any;
          try {
            parsedSchedule = JSON.parse(body.schedule);
          } catch {
            throw new BadRequestException('El formato de schedule no es válido.');
          }
      
          const dto = plainToInstance(CreateVolunteerAdviserDto, {
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
      
  }
  