import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubAreas } from './entities/area-volunteer/sub-areas.entity';
import { Repository } from 'typeorm';
import { AreasStaff } from './entities/area-volunteer/areas-staff.entity';

@Injectable()
export class SubAreaService {
    constructor(
        @InjectRepository(SubAreas)
        private readonly subAreaRepository: Repository<SubAreas>,
    ) {}

    async findOne(id: number): Promise<SubAreas> {
        // usamos findOne con un objeto de opciones para poder especificar las relaciones
        const subArea = await this.subAreaRepository.findOne({ 
            where: { id: id}, // la condición para encontrar la sub-area
            relations: ['areaStaff']
         });
        if (!subArea){
            throw new NotFoundException(`SubÁrea con ID ${id} no encontrada`);    
        }
        return subArea;
    }

    /**
     * Obtiene todas las subáreas de ASESORIES de AreaStaff
     */
    async findAllAsesorySubAreas(): Promise<SubAreas[]> {
        return this.subAreaRepository.find({
            where: {
                // navegamos a través de la relacion 'areaStaff' para filtrar por su nombre
                areaStaff: {
                    name: 'ASESORIES'
                }
            }
        })
    }

}