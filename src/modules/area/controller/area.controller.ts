import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { AreaService } from '../service/area.service';
import { CreateAreaDto } from '../dto/create-area.dto';
import { UpdateAreaDto } from '../dto/update-area.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
//@UseGuards(JwtAuthGuard)
//@ApiBearerAuth() //candadito
@ApiTags('Areas')
@Controller('areas')
export class AreaController {
  constructor(private readonly areaService: AreaService) {}
  @Get('staff')
  async getAllAreasStaff() {
    return this.areaService.findAllAreasStaff();
  }
  
  @Get('/subareas/:id')
  async findAllSubAreas(@Param('id') idArea: number) {
    console.log('..');
    return this.areaService.findAllSubAreas(+idArea);
  }
  @Get('staff/:id/subareas')
  async getSubAreasByAreaStaffId(@Param('id', ParseIntPipe) idArea: number) {
    console.log(`Buscando subáreas para Area Staff con ID: ${idArea}`);
    return this.areaService.findAllSubAreasByAreaStaffId(idArea);
  }
  @Get('subareas/:id/questions')
  async getQuestionsBySubAreaId(@Param('id', ParseIntPipe) idSubArea: number) {
    console.log(`Buscando preguntas para SubÁrea con ID: ${idSubArea}`);
    return this.areaService.findQuestionsBySubAreaId(idSubArea);
  }
  @Get(':id')
  async findOneAreaStaffWithSubAreas(@Param('id', ParseIntPipe) id: number) {
    return this.areaService.findOne(id);
  }
  @Get()
  async getAllAreas() {
    return this.areaService.findAllAreas();
  }
}
