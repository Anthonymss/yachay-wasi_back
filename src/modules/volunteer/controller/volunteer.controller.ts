import { BadRequestException, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { VolunteerService } from '../service/volunteer.service';
import { Volunteer } from '../entities/volunteer.entity';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
//@UseGuards(JwtAuthGuard)
//@ApiBearerAuth()//candado
@ApiTags('Volunteer')
@Controller('volunteer')
export class VolunteerController {
  constructor(private readonly volunteerService: VolunteerService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  async createVolunteer(@Req() req: FastifyRequest) {
    const parts = await (req as any).parts();
    return this.volunteerService.handleMultipartAndCreate(parts);
  }

}
