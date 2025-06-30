// src/modules/volunteer/application.service.ts

import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateApplicationDto } from '../dto/create-application.dto';
import { Volunteers } from '../entities/volunteers.entity';
import { Schedule } from '../entities/schedule.entity';
import { ResponsesVolunteers } from '../entities/responses-volunteers.entity';
import { SubAreas } from '../../area/entities/area-volunteer/sub-areas.entity';
import { QuestionsVolunteers } from '../../area/entities/area-volunteer/questions-volunteers.entity';

@Injectable()
export class ApplicationService {
    constructor(private readonly dataSource: DataSource) {}

    async createApplication(dto: CreateApplicationDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const volunteerRepo = queryRunner.manager.getRepository(Volunteers);
            const scheduleRepo = queryRunner.manager.getRepository(Schedule);
            const responseRepo = queryRunner.manager.getRepository(ResponsesVolunteers);
            
            const subAreaExists = await queryRunner.manager.findOneBy(SubAreas, { id: dto.subAreaId });
            if (!subAreaExists) {
                throw new NotFoundException(`La SubÁrea con ID ${dto.subAreaId} a la que se intenta postular no existe.`);
            }

            // 1. Crear y guardar el voluntario | mapeo manual y explicito para el voluntario
            const volunteer = volunteerRepo.create({
                ...dto,
                date_postulation: new Date(),
            });
            const savedVolunteer = await volunteerRepo.save(volunteer);

            // Lógica para guardar horarios y respuestas necesita los mapeos
            // 2. Guardar los horarios (si los hay)
            if (dto.schedules && dto.schedules.length > 0) {
                const schedules = dto.schedules.map(s => scheduleRepo.create({ 
                    ...s, volunteer: savedVolunteer }));
                await scheduleRepo.save(schedules);
            }

            // 3. Guardar las respuestas (si las hay)
            if (dto.responses && dto.responses.length > 0) {
                const responses = dto.responses.map(r => responseRepo.create({
                    response: r.reply,
                    question: { id: r.questionId },
                    volunteer: savedVolunteer,
                }));
                await responseRepo.save(responses);
            }

            await queryRunner.commitTransaction();
            return { message: 'Postulación creada con éxito', volunteerId: savedVolunteer.id };

        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException(`Error al crear la postulación: ${error.message}`);
        } finally {
            await queryRunner.release();
        }
    }
}