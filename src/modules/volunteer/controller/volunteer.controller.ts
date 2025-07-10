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
  Put,
  ParseIntPipe,
  BadRequestException,
  Delete,
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
import { CreateVolunteerAdviserDto } from '../dto/create-volunteer-Adviser.dto';
import { UpdateVolunteerAdviserDto, UpdateVolunteerStaffDto } from '../dto/update-volunteer.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
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
  
  //update
  @Put('staff/:id')
  @UseInterceptors(FileInterceptor('file'))
  async updateStaff(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.volunteerService.updateVolunteerStaffWithRaw(id, body, file);
  }
  
  @Put('adviser/:id')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'file', maxCount: 1 },
    { name: 'video', maxCount: 1 },
  ]))
  async updateAdviser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
    @UploadedFiles() files: {
      file?: Express.Multer.File[];
      video?: Express.Multer.File[];
    },
  ) {
    const file = files?.file?.[0];
    const video = files?.video?.[0];
    return this.volunteerService.updateVolunteerAdviserWithRaw(id, body, file, video);
  }
  @Delete('delete/:id')
  async deleteVolunteer(@Param('id', ParseIntPipe) id: number) {
    return this.volunteerService.softDeleteVolunteer(id);
  }
    
  

}
