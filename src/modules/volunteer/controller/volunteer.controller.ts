import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  UploadedFiles,
  Get,
  Query,
  UseGuards,
  Param,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { VolunteerService } from '../service/volunteer.service';
import { CreateVolunteerStaffDto } from '../dto/create-volunteer-staff.dto';
import { TYPE_VOLUNTEER } from '../entities/volunteer.entity';
import { VolunteerResponseDto } from '../dto/volunteer-response.dto';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { ROLE } from '../../../shared/enum/role.enum';
import { CreateVolunteerADdviserDto } from '../dto/create-volunteer-Adviser.dto';
@UseGuards(RolesGuard)
@Roles(ROLE.ADMIN)
//@UseGuards(JwtAuthGuard)// verificador de token
@ApiBearerAuth() //candado
@ApiTags('Volunteer')
@Controller('volunteer')
export class VolunteerController {
  constructor(private readonly volunteerService: VolunteerService) {}

  @Post('staff')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async createVolunteer (
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateVolunteerStaffDto,
  ) {
    return this.volunteerService.createVolunteerStaff(dto, file);
  }

  @Post('adviser')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'file', maxCount: 1 },
      { name: 'video', maxCount: 1 },
    ]),
  )
  async createVolunteerAdviser(
    @UploadedFiles()
    files: { file: Express.Multer.File[]; video: Express.Multer.File[] },
    @Body() body: any,
  ) {
    const dto = await this.volunteerService.prepareAdviserDto(body);
    return this.volunteerService.createVolunteerAdviser(
      dto,
      files.file?.[0],
      files.video?.[0],
    );
  }
  @Get('enums')
  @ApiResponse({ status: 200, description: 'Listado de enums del formulario' })
  getVolunteerEnums() {
    return this.volunteerService.getVolunteerEnums();
  }

  @Get()
  @ApiQuery({ name: 'type', enum: TYPE_VOLUNTEER, required: false })
  @ApiQuery({ name: 'page', required: false })
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

  @Post(':id/approve')
  @ApiResponse({
    status: 200,
    description: 'Voluntario aprobado y usuario creado',
  })
  async approveVolunteer(@Param('id') id: number) {
    return this.volunteerService.approveVolunteer(id);
  }
  @Post(':id/reject')
  @ApiResponse({
    status: 200,
    description: 'Voluntario rechazado',
  })
  async rejectVolunteer(@Param('id') id: number) {
    return this.volunteerService.rejectVolunteer(id);
  }

  @Get('profile-volunteer/:id')
  @ApiResponse({
    status: 200,
    description: 'Perfil del voluntario',
    type: VolunteerResponseDto,
  })
  async getProfileVolunteer(@Param('id') id: number): Promise<VolunteerResponseDto> {
    return this.volunteerService.getProfileVolunteer(id);
  } 
}
