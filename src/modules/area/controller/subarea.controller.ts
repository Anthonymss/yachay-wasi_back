import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { SubAreaService } from "../service/subarea.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('SubAreas')
@Controller('subareas')
export class SubAreaController {
    constructor(private readonly subAreaService: SubAreaService){

    }

    @Get('type/asesories')
    async findAllAsesorySubareas() {
        return this.subAreaService.findAllAsesorySubAreas();
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number){
        return this.subAreaService.findOne(id);
    }
}