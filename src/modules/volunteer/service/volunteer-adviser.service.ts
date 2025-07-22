// volunteer-staff.service.ts
import {
    BadRequestException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { Volunteer, TYPE_VOLUNTEER } from '../entities/volunteer.entity';
  import { CreateVolunteerAdviserDto } from '../dto/create-volunteer-Adviser.dto';
  import { UpdateVolunteerAdviserDto } from '../dto/update-volunteer.dto';
  import { S3Service } from 'src/shared/s3/S3.service';
  import { Schedule } from '../entities/schedule.entity';
  import { ResponseVolunteer } from '../entities/response-volunteer.entity';
  import { QuestionVolunteer } from 'src/modules/area/entities/area-volunteer/question-volunteer.entity';
  import { VolunteerSharedService } from './volunteer-shared.service';
  
  @Injectable()
  export class VolunteerAdviserService {

    constructor(
      @InjectRepository(Volunteer)
      private readonly volunteerRepository: Repository<Volunteer>,
      @InjectRepository(ResponseVolunteer)
      private readonly responseVolunteerRepository: Repository<ResponseVolunteer>,
      @InjectRepository(QuestionVolunteer)
      private readonly questionVolunteerRepository: Repository<QuestionVolunteer>,
      private readonly s3Service: S3Service,
      private readonly sharedService: VolunteerSharedService,
    ) {}
    
    async createVolunteerAdviser(
      dto: CreateVolunteerAdviserDto,
      file?: Express.Multer.File,
      video?: Express.Multer.File,
    ): Promise<Volunteer> {
      // validación de archivos
      if (!file && !video) throw new BadRequestException('Debes subir tanto el archivo PDF como el video');
      if (!file) throw new BadRequestException('Debes subir el archivo PDF');
      if (!video) throw new BadRequestException('Debes subir el archivo de video');
      if (file.mimetype !== 'application/pdf') throw new BadRequestException('El archivo CV debe ser un PDF válido'); 
      if (!video.mimetype.startsWith('video/')) throw new BadRequestException('El archivo de video debe ser válido');
      
      // valida datos
      await this.sharedService.validateData(dto.email, TYPE_VOLUNTEER.ADVISER, file);
      // sube archivos a S3
      const [cvUrl, videoUrl] = await Promise.all([
        this.s3Service.uploadFile(file),
        this.s3Service.uploadFile(video),
      ]);
    
      // crea voluntario
      const volunteer = this.volunteerRepository.create({
        ...dto, // operador spread permite mantener datos existentes del DTO mientras se agregan campos adicionales
        cvUrl,
        videoUrl,
        typeVolunteer: TYPE_VOLUNTEER.ADVISER,
        datePostulation: new Date(),
        //schedules: [],
      });
    
      // guarda voluntario
      const saved = await this.volunteerRepository.save(volunteer);
    
      // guarda los horarios
      const schedules = dto.schedule.map((s) => ({ // mapea horarios del dto
        ...s,
        volunteer: saved, // asocia el voluntario guardado
      }));
    
      await this.volunteerRepository.manager
        .getRepository(Schedule)
        .save(schedules); // guarda los horarios en la base de datos

        // guarda las respuestas si existen
        if (dto.responses && dto.responses.length > 0) { // verifica si hay respuestas
          const responsesToSave: ResponseVolunteer[] = [];
          for (const resp of dto.responses) {
            const question = await this.questionVolunteerRepository.findOne({ where: { id: resp.questionId } }); // BUSCA PREGUNTA EN LA BD
            if (question) {
              // crea entidades de respuesta asociando pregunta y voluntario
              const responseEntity = this.responseVolunteerRepository.create({
                questionVolunteer: question,
                volunteer: saved,
                response: resp.response,
              });
              responsesToSave.push(responseEntity);
            }
          }
          if (responsesToSave.length > 0) {
            await this.responseVolunteerRepository.save(responsesToSave); // GUARDA LA RSP en la BD
          }
        }

        // envia email de confirmación
        await this.sharedService.sendConfirmationEmail(saved);

      return saved; // retorna el voluntario guardado con todos sus datos
    }

    async updateVolunteerAdviser(
      id: number,
      dto: UpdateVolunteerAdviserDto,
      file?: Express.Multer.File,
      video?: Express.Multer.File,
    ): Promise<Volunteer> {
      const volunteer = await this.volunteerRepository.findOne({
        where: { id },
        relations: ['schedules'],
      });
      if (!volunteer) throw new NotFoundException('Voluntario no encontrado');
    
      if (file) {
        if (file.mimetype !== 'application/pdf')
          throw new BadRequestException('El archivo debe ser un PDF válido');
        volunteer.cvUrl = await this.s3Service.uploadFile(file);
      }
    
      if (video) {
        if (!video.mimetype.startsWith('video/'))
          throw new BadRequestException('El archivo de video debe ser válido');
        volunteer.videoUrl = await this.s3Service.uploadFile(video);
      }
    
      Object.assign(volunteer, dto);
    
      if (dto.schedule) {
        await this.volunteerRepository.manager
          .getRepository(Schedule)
          .delete({ volunteer: { id } });
    
        const schedules = dto.schedule.map((s) => ({
          ...s,
          volunteer,
        }));
    
        await this.volunteerRepository.manager
          .getRepository(Schedule)
          .save(schedules);
      }
    
      if (dto.responses) {
        await this.responseVolunteerRepository.delete({ volunteer: { id } });
        const responses: ResponseVolunteer[] = [];
    
        for (const resp of dto.responses) {
          const question = await this.questionVolunteerRepository.findOne({
            where: { id: resp.questionId },
          });
          if (question) {
            responses.push(
              this.responseVolunteerRepository.create({
                questionVolunteer: question,
                volunteer,
                response: resp.response,
              }),
            );
          }
        }
    
        if (responses.length > 0) {
          await this.responseVolunteerRepository.save(responses);
        }
      }
    
      return this.volunteerRepository.save(volunteer);
    }
    async updateVolunteerAdviserWithRaw(
      id: number,
      body: any,
      file?: Express.Multer.File,
      video?: Express.Multer.File,
    ) {
      const dto: UpdateVolunteerAdviserDto = await this.sharedService.mapAndValidateAdviserDto(body);
      return this.updateVolunteerAdviser(id, dto, file, video);
    }
  }
  