import { Injectable } from '@nestjs/common';
import { CreateVolunteerDto } from '../dto/create-volunteer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Volunteer } from '../entities/volunteer.entity';
import { Repository } from 'typeorm';
import { CloudinaryService } from 'src/shared/cloudinary/cloudinary.service';

@Injectable()
export class VolunteerService {
  constructor(
    @InjectRepository(Volunteer)
    private readonly volunteerRepository: Repository<Volunteer>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(dto: CreateVolunteerDto, file: Express.Multer.File): Promise<Volunteer> {
    const url = await this.cloudinaryService.uploadFile(file);

    const volunteer = this.volunteerRepository.create({
      ...dto,
      cvUrl: url,
      datePostulation: new Date(),
    });

    return this.volunteerRepository.save(volunteer);
  }
}
