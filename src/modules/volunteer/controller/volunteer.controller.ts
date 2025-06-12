import { BadRequestException, Controller, Post, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { VolunteerService } from '../service/volunteer.service';
import { Volunteers } from '../entities/volunteers.entity';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

// ENDPOINTS
//@UseGuards(JwtAuthGuard)
//@ApiBearerAuth()//candado
@ApiTags('Volunteer')
@Controller('volunteer')
export class VolunteerController {
  constructor(private readonly volunteerService: VolunteerService) { }

 
  @Post()
  @ApiConsumes('multipart/form-data')
  async createVolunteer(@Req() req: FastifyRequest) {
    const parts = await (req as any).parts();
    return this.volunteerService.handleMultipartAndCreate(parts);
  }

}
