import { Injectable } from '@nestjs/common';
import { CreateVolunteerDto } from '../dto/create-volunteer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Volunteer } from '../entities/volunteer.entity';
import { Repository } from 'typeorm';
import { CloudinaryService } from 'src/shared/cloudinary/cloudinary.service';

export interface UploadedFile {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  fieldname: string;
  size: number;
  encoding?: string;
}

@Injectable()
export class VolunteerService {
  constructor(
    @InjectRepository(Volunteer)
    private readonly volunteerRepository: Repository<Volunteer>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    createVolunteerDto: CreateVolunteerDto,
    file: UploadedFile,
  ): Promise<Volunteer> {
    const multerFile: Express.Multer.File = {
      ...file,
      fieldname: file.fieldname,
      originalname: file.originalname,
      encoding: file.encoding ?? '',
      mimetype: file.mimetype,
      size: file.size,
      buffer: file.buffer,
      destination: '',
      filename: file.originalname,
      path: '',
      stream: undefined as any,
    };

    const url = await this.cloudinaryService.uploadFile(multerFile);

    const volunteer = this.volunteerRepository.create({
      ...createVolunteerDto,
      cvUrl: url,
      datePostulation: new Date(),
    });

    return this.volunteerRepository.save(volunteer);
  }
}
