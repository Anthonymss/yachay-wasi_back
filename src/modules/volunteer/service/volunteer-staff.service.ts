import {
    BadRequestException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { Volunteer, TYPE_VOLUNTEER } from '../entities/volunteer.entity';
  import { CreateVolunteerStaffDto } from '../dto/create-volunteer-staff.dto';
  import { UpdateVolunteerStaffDto } from '../dto/update-volunteer.dto';
  import { S3Service } from 'src/shared/s3/S3.service';
  import { VolunteerSharedService } from './volunteer-shared.service';
  
  @Injectable()
  export class VolunteerStaffService {
    constructor(
      @InjectRepository(Volunteer)
      private readonly volunteerRepository: Repository<Volunteer>,
      private readonly s3Service: S3Service,
      private readonly sharedService: VolunteerSharedService,
    ) {}
    async createVolunteerStaff(
        dto: CreateVolunteerStaffDto,
        file?: Express.Multer.File,
      ): Promise<Volunteer> {
        if (!file) throw new BadRequestException('Debes subir el archivo PDF');
        await this.sharedService.validateData(dto.email, TYPE_VOLUNTEER.STAFF, file);
        const cvUrl = await this.s3Service.uploadFile(file);
    
        const volunteer = this.volunteerRepository.create({
          ...dto,
          cvUrl,
          typeVolunteer: TYPE_VOLUNTEER.STAFF,
          datePostulation: new Date(),
        });
    
        const saved = await this.volunteerRepository.save(volunteer);
        await this.sharedService.sendConfirmationEmail(saved);
        return saved;
      }
      async updateVolunteerStaff(
        id: number,
        dto: UpdateVolunteerStaffDto,
        file?: Express.Multer.File,
      ): Promise<Volunteer> {
        const volunteer = await this.volunteerRepository.findOne({ where: { id } });
        if (!volunteer) throw new NotFoundException('Voluntario no encontrado');
      
        if (file) {
          if (file.mimetype !== 'application/pdf')
            throw new BadRequestException('El archivo debe ser un PDF válido');
          volunteer.cvUrl = await this.s3Service.uploadFile(file);
        }
      
        Object.assign(volunteer, dto);
        return this.volunteerRepository.save(volunteer);
      }
      async updateVolunteerStaffWithRaw(
        id: number,
        body: any,
        file?: Express.Multer.File,
      ) {
        const dto: UpdateVolunteerStaffDto = await this.sharedService.mapAndValidateStaffDto(body);
        return this.updateVolunteerStaff(id, dto, file);
      }
  }
  