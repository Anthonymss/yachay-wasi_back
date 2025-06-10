import { Injectable } from '@nestjs/common';
import { CreateVolunteerDto } from '../dto/create-volunteer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Volunteer } from '../entities/volunteer.entity';
import { Repository } from 'typeorm';
import { CloudinaryService } from 'src/shared/cloudinary/cloudinary.service';
import { MultipartFile } from '@fastify/multipart';
import { parseMultipart, UploadedFile } from 'src/shared/others/multipart';

@Injectable()
export class VolunteerService {
  constructor(
    @InjectRepository(Volunteer)
    private readonly volunteerRepository: Repository<Volunteer>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async handleMultipartAndCreate(parts: AsyncIterableIterator<MultipartFile | any>) {
    const { dto, file } = await parseMultipart(parts);
    this.create(dto, file)
    return 'Volunter is created'
  }

  async create(dto: CreateVolunteerDto, file: UploadedFile): Promise<Volunteer> {
    const multerFile: Express.Multer.File = {
      ...file,
      destination: '',
      filename: file.originalname,
      path: '',
      stream: undefined as any,
      encoding: file.encoding ?? '', 
    };

    const url = await this.cloudinaryService.uploadFile(multerFile);

    const volunteer = this.volunteerRepository.create({
      ...dto,
      cvUrl: url,
      datePostulation: new Date(),
    });

    return this.volunteerRepository.save(volunteer);
  }
}
