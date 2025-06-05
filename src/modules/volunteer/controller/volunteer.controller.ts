import { BadRequestException, Controller, Post, Req } from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { VolunteerService, UploadedFile } from '../service/volunteer.service';
import { Volunteer } from '../entities/volunteer.entity';
import { FastifyRequest } from 'fastify';
import { MultipartFile } from '@fastify/multipart';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateVolunteerDto } from '../dto/create-volunteer.dto';

//@UseGuards(JwtAuthGuard)
//@ApiBearerAuth()
@ApiTags('Volunteer')
@Controller('volunteer')
export class VolunteerController {
  constructor(private readonly volunteerService: VolunteerService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  async createVolunteer(@Req() req: FastifyRequest): Promise<Volunteer> {
    const file = (await (req as any).file()) as MultipartFile;
    if (!file) {
      throw new BadRequestException('CV file is required');
    }

    const body = (await (req as any).body) as Record<string, any>;

    const dto = plainToInstance(CreateVolunteerDto, body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const buffer = await file.toBuffer();
    const adaptedFile: UploadedFile = {
      buffer,
      mimetype: file.mimetype,
      originalname: file.filename,
      fieldname: file.fieldname,
      size: buffer.length,
      encoding: file.encoding || '',
    };

    return this.volunteerService.create(dto, adaptedFile);
  }
}
