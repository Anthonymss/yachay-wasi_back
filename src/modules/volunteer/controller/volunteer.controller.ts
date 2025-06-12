import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  UploadedFiles,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { VolunteerService } from '../service/volunteer.service';
import { CreateVolunteerStaffDto } from '../dto/create-volunteer-staff.dto';
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
}
