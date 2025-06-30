/**
 * Archivo para exponer el servicio a traves de un endpoint POST
 */
import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { ApplicationService } from '../service/application.service';
import { CreateApplicationDto } from '../dto/create-application.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Applications')
@Controller('applications')
export class ApplicationController {
    constructor(private readonly applicationService: ApplicationService) {}

    @Post()
    create(@Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) createApplicationDto: CreateApplicationDto) {
        return this.applicationService.createApplication(createApplicationDto);
    }
}