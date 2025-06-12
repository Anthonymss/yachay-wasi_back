import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AreaService } from './area.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
//@UseGuards(JwtAuthGuard)
//@ApiBearerAuth() //candadito
@ApiTags('Area')
@Controller('areas')
export class AreaController {
  constructor(private readonly areaService: AreaService) {}

  @Get()
  async findAllAreas() {
    return this.areaService.findAll();
  }
  @Get('/subareas/:id')
  async findAllSubAreas(@Param('id') idArea: number) {
    console.log('..');
    return this.areaService.findAllSubAreas(+idArea);
  }
}
