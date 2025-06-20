import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  UploadedFiles,
  Get,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { VolunteerService } from '../service/volunteer.service';
import { CreateVolunteerStaffDto } from '../dto/create-volunteer-staff.dto';
import { TYPE_VOLUNTEER } from '../entities/volunteer.entity';
import { VolunteerResponseDto } from '../dto/volunteer-response.dto';
//@UseGuards(JwtAuthGuard)
@ApiBearerAuth() //candado
@ApiTags('Volunteer')
@Controller('volunteer')
export class VolunteerController {
  constructor(private readonly volunteerService: VolunteerService) {}

  @Post('staff')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async createVolunteer(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateVolunteerStaffDto,
  ) {
    return this.volunteerService.createVolunteerStaff(dto, file);
  }

  @Post('adviser')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'file', maxCount: 1 },
      { name: 'video', maxCount: 1 },
    ]),
  )
  async createVolunteerAdviser(
    @UploadedFiles()
    files: {
      file: Express.Multer.File[];
      video: Express.Multer.File[];
    },
    @Body() body: any,
  ) {
    const dto = await this.volunteerService.prepareAdviserDto(body);
    const { file, video } = files;
    return this.volunteerService.createVolunteerAdviser(
      dto,
      file?.[0],
      video?.[0],
    );
  }
  @Get()
 @ApiQuery({ name: 'type', enum: TYPE_VOLUNTEER, required: false })  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de voluntarios',
    type: VolunteerResponseDto,
    isArray: true,
  })
  async findAll(
    @Query('type') type: TYPE_VOLUNTEER,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.volunteerService.findAll(type, page, limit);
  }
}
