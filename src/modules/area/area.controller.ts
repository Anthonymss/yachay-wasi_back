// src/modules/area/area.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe, // Importar ParseIntPipe para validar IDs numéricos
  Query, // Importar Query para parámetros de consulta
} from '@nestjs/common';
import { AreaService } from './area.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger'; // Importar ApiQuery

// ENDPOINTS CONSUMIBLES
// orden importa, rutas especificas deben ir antes que las dinamicas
//@UseGuards(JwtAuthGuard) // Descomentar cuando tengas la autenticación configurada
//@ApiBearerAuth() // candadito
@ApiTags('Areas') // Mejor usar "Areas" en plural

@Controller('areas')
export class AreaController {
  constructor(private readonly areaService: AreaService) { }
  // RUTAS ESPECIFICAS PRIMERO
  /**
    * endpoint para obtener todas las areas staff excepto 'asesories'
    */
  @Get('staff')
  async getAllAreasStaff() {
    return this.areaService.findAllAreasStaff();
  }
  //if it works

  // 2. Obtener todas las SubÁreas de un Área Staff específica
  // Ejemplo: GET /areas/staff/1/subareas
  @Get('staff/:id/subareas')
  async getSubAreasByAreaStaffId(@Param('id', ParseIntPipe) idArea: number) {
    console.log(`Buscando subáreas para Area Staff con ID: ${idArea}`);
    return this.areaService.findAllSubAreasByAreaStaffId(idArea);
  }
  // IF IT WORKS

  // 3. Obtener todas las Preguntas de una SubÁrea específica
  // Ejemplo: GET /areas/subareas/5/questions
  @Get('subareas/:id/questions')
  async getQuestionsBySubAreaId(@Param('id', ParseIntPipe) idSubArea: number) {
    console.log(`Buscando preguntas para SubÁrea con ID: ${idSubArea}`);
    return this.areaService.findQuestionsBySubAreaId(idSubArea);
  }
  // IF IT WORKS

  // RUTAS DINÁMICAS DESPUES 
  @Get(':id')
  // obtener un área POR SU ID con sus subareas
  async findOneAreaStaffWithSubAreas(@Param('id', ParseIntPipe) id: number) { // Usar ParseIntPipe para validar que id es número
    return this.areaService.findOne(id);
  }
  // NOT WORKING

  // 3. Obtener todas las Preguntas de área asesoria
  // Ejemplo: GET /areas/subareas/5/questions
  @Get(':id/questions')
  async getQuestionByAreaId(@Param('id', ParseIntPipe) idArea: number) {
    console.log(`Buscando preguntas para Área con ID: ${idArea}`);
    return this.areaService.findQuestionsByAreaId(idArea);
  }
  // IF IT WORKS

  // RUTAS GENÉRICAS AL FINAL

  // Mantenemos los métodos CRUD básicos
  @Post()
  create(@Body() createAreaDto: CreateAreaDto) {
    return this.areaService.create(createAreaDto);
  }


  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateAreaDto: UpdateAreaDto) {
    // return this.areaService.update(id, updateAreaDto); // Descomentar cuando implementes update
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    // return this.areaService.remove(id); // Descomentar cuando implementes remove
  }

  /* ParseIntPipe -> buena practica de seguridad y validación, asegura que ID sean números validos*/

  /************************************************************************************************/

  // 1. Obtener todas las Áreas (Staff y Asesoría)
  @Get()
  async getAllAreas() {
    return this.areaService.findAllAreas();
  }
  // IF IT WORKS


  /*// 4. Obtener todas las SubÁreas con sus Preguntas asociadas
  // Ejemplo: GET /areas/subareas-with-questions
  @Get('subareas-with-questions')
  async getAllSubAreasWithQuestions() {
    return this.areaService.findAllSubAreasWithQuestions();
  }*/

  // 5. Obtener todas las Áreas Staff, sus SubÁreas y las Preguntas de cada SubÁrea
  // Este endpoint devuelve una estructura anidada completa.
  // Ejemplo: GET /areas/staff-full-structure
  /*@Get('staff-full-structure')
  async getAllStaffAreasFullStructure() {
    return this.areaService.findAllStaffAreasWithSubAreasAndQuestions();
  }*/

  // 6. Obtener preguntas de SubÁreas que pertenecen a una o varias Áreas Staff
  // Ejemplo: GET /areas/questions-by-area-staff-ids?areaIds=1,3,5
  /*@Get('questions-by-area-staff-ids')
  @ApiQuery({ name: 'areaIds', required: true, type: String, description: 'Lista de IDs de áreas separadas por comas (ej. 1,2,3)' })
  async getQuestionsByAreaStaffIds(@Query('areaIds') areaIds: string) {
    const ids = areaIds.split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id));
    if (ids.length === 0) {
      // Manejar el caso de IDs inválidos o vacíos
      throw new Error('Debe proporcionar al menos un ID de área válido.');
    }
    return this.areaService.getQuestionsByAreaStaffIds(ids);
  }*/

}