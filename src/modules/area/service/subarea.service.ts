import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubArea } from '../entities/area-volunteer/sub-area.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SubAreaService {
    constructor(
        @InjectRepository(SubArea)
        private readonly subAreaRepository: Repository<SubArea>,
    ) { }

    async findOne(id: number): Promise<SubArea> {
        const subArea = await this.subAreaRepository.findOne({
            where: { id: id },
            relations: ['areaStaff']
        });
        if (!subArea) {
            throw new NotFoundException(`SubÁrea con ID ${id} no encontrada`);
        }
        return subArea;
    }

    async findAllAsesorySubAreas(): Promise<SubArea[]> {
        return this.subAreaRepository.find({
            where: {
                areaStaff: {
                    name: 'ASESORIES'
                }
            }
        })
    }

}