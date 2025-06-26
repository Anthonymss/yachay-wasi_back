import { Injectable } from '@nestjs/common';
import { CreateVolunteerDto } from '../dto/create-volunteer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Volunteers } from '../entities/volunteers.entity';
import { Repository } from 'typeorm';
import { CloudinaryService } from 'src/shared/cloudinary/cloudinary.service';
import { MultipartFile } from '@fastify/multipart';
import { parseMultipart, UploadedFile } from 'src/shared/others/multipart';
import { ResponsesVolunteers } from '../entities/responses-volunteers.entity';
import { QuestionsVolunteers } from 'src/modules/area/entities/area-volunteer/questions-volunteers.entity';
import { SubAreas } from 'src/modules/area/entities/area-volunteer/sub-areas.entity';
import { AreasStaff } from 'src/modules/area/entities/area-volunteer/areas-staff.entity';
// IMPLEMENTACION

// interface para datos parseados del multipart
interface ParsedVolunteerForm {
  dto: CreateVolunteerDto;
  cvFile?: UploadedFile; // Nombre del campo para el CV
  videoFile?: UploadedFile; // Nombre del campo para el video
  // Otras propiedades de archivo si existen
}


@Injectable()
export class VolunteerService {
  constructor(
    @InjectRepository(Volunteers)
    private readonly volunteerRepository: Repository<Volunteers>,
    /*@InjectRepository(ResponsesVolunteers)// inyecta repositorio de respuestas dinamicas
    private readonly responsesVolunteerRepository: Repository<ResponsesVolunteers>,
    @InjectRepository(QuestionsVolunteers) // Inyecta el repositorio de preguntas para validación
    private readonly questionRepository: Repository<QuestionsVolunteers>,
    @InjectRepository(SubAreas) // Inyecta el repositorio de subáreas para asociar
    private readonly subAreaRepository: Repository<SubAreas>,
    @InjectRepository(AreasStaff) // Inyecta el repositorio de áreas staff para asociar
    private readonly areaStaffRepository: Repository<AreasStaff>,*/
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async handleMultipartAndCreate(parts: AsyncIterableIterator<MultipartFile | any>) {
    const { dto, file } = await parseMultipart(parts);
    this.create(dto, file)
    return 'Volunter is created'
  }

  async create(dto: CreateVolunteerDto, file: UploadedFile): Promise<Volunteers> {
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
      cv_url: url,
      date_postulation: new Date(),
    });

    return this.volunteerRepository.save(volunteer);
  }
}
