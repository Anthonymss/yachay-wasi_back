import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { VolunteerService } from '../service/volunteer.service';
import { CreateVolunteerDto } from '../dto/create-volunteer.dto';
//@UseGuards(JwtAuthGuard)
//@ApiBearerAuth()//candado
@ApiTags('Volunteer')
@Controller('volunteer')
export class VolunteerController {
  constructor(private readonly volunteerService: VolunteerService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async createVolunteer(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateVolunteerDto,
  ) {
    return this.volunteerService.create(dto, file);
  }
}
