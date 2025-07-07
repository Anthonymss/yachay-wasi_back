import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { SubAreaService } from "./subarea.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('SubAreas') // para la documentacion de Swagger
@Controller('subareas')
export class SubAreaController {
    constructor(private readonly subAreaService: SubAreaService){

    }

    /**
     * EndPoint para obtener todas las sub-areas del tipo 'ASESORIES'
     */
    @Get('type/asesories') // creamos una ruta clara
    async finAllAserorySubareas() {
        return this.subAreaService.findAllAsesorySubAreas();
    }
    //if it works

    /**
     * Endpoint para obtener una subarea por su ID
     */
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number){
        return this.subAreaService.findOne(id);
    }
    // if it works
}