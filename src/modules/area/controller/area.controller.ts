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
  // llama a findAllAreasStaff del areaService para obtener las áreas de tipo staff
  @Get('staff')
  async getAllAreasStaff() {
    return this.areaService.findAllAreasStaff();
  }
  
  // obtener todas las subáreas de un área específica
  @Get('/subareas/:id')
  async findAllSubAreas(@Param('id') idArea: number) {
    console.log('..');
    return this.areaService.findAllSubAreas(+idArea);
  }

  // obtener subareas asociadas a un area staff especifico
  @Get('staff/:id/subareas')
  async getSubAreasByAreaStaffId(@Param('id', ParseIntPipe) idArea: number) {
    console.log(`Buscando subáreas para Area Staff con ID: ${idArea}`);
    return this.areaService.findAllSubAreasByAreaStaffId(idArea);
  }

  // obtiene preguntas asociadas a una subárea específica
  @Get('subareas/:id/questions')
  async getQuestionsBySubAreaId(@Param('id', ParseIntPipe) idSubArea: number) {
    console.log(`Buscando preguntas para SubÁrea con ID: ${idSubArea}`);
    return this.areaService.findQuestionsBySubAreaId(idSubArea);
  }

  // obitene un área y sus subáreas por su ID
  @Get(':id')
  async findOneAreaStaffWithSubAreas(@Param('id', ParseIntPipe) id: number) {
    return this.areaService.findOne(id);
  }

  // obtener todas las áreas
  @Get()
  async getAllAreas() {
    return this.areaService.findAllAreas();
  }
}
