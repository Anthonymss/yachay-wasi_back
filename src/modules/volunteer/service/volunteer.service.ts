// volunteer.service.ts
// SERVICIO PRINCIPAL PARA GESTIONAR VOLUNTARIOS
// Este servicio utiliza otros servicios auxiliares para manejar
// la creación, actualización, eliminación y consulta de voluntarios
// como staff y advisers. También maneja la paginación y
// aprobación/rechazo de voluntarios.
import {
  Injectable,
} from '@nestjs/common';
import { CreateVolunteerStaffDto } from '../dto/create-volunteer-staff.dto';
import {
  TYPE_VOLUNTEER,
  Volunteer,
} from '../entities/volunteer.entity';
import { CreateVolunteerAdviserDto } from '../dto/create-volunteer-Adviser.dto';
import { VolunteerResponseDto } from '../dto/volunteer-response.dto';
import { VolunteerSharedService } from './volunteer-shared.service';
import { VolunteerStaffService } from './volunteer-staff.service';
import { VolunteerAdviserService } from './volunteer-adviser.service';
@Injectable() // inyeccion de dependencias
export class VolunteerService {
  // servicios auxiliares 
  constructor(
    private readonly sharedService: VolunteerSharedService, // servicio compartido para operaciones comunes
    private readonly volunteerStaffService: VolunteerStaffService, // servicio para manejar voluntarios staff
    private readonly volunteerAdviserService: VolunteerAdviserService, // servicio para manejar voluntarios advisers
  ) { }

  // metodos principales
  async createVolunteerStaff(dto: CreateVolunteerStaffDto,
    file?: Express.Multer.File
  ): Promise<Volunteer> {
    return this.volunteerStaffService.createVolunteerStaff(dto, file);
  }

  async createVolunteerAdviser(
    dto: CreateVolunteerAdviserDto,
    file?: Express.Multer.File,
    video?: Express.Multer.File,
  ): Promise<Volunteer> {
    return this.volunteerAdviserService.createVolunteerAdviser(dto, file, video);
  }

  // lista de voluntarios segun el tipo, con paginacion
  async findAll(type: TYPE_VOLUNTEER, page = 1, limit = 10) {
    return this.sharedService.findAll(type, page, limit);
  }

  // aprueba o rechaza un voluntario
  async approveVolunteer(id: number): Promise<{ message: string }> {
    return this.sharedService.approveVolunteer(id);
  }
  async rejectVolunteer(id: number): Promise<{ message: string }> {
    return this.sharedService.rejectVolunteer(id);
  }

  // prepara el dto para adviser a partir del body
  async prepareAdviserDto(body: any): Promise<CreateVolunteerAdviserDto> {
    return this.sharedService.prepareAdviserDto(body);
  }

  // devuelve los enums relacionados con los voluntarios
  // como tipos, estados, etc.
  async getVolunteerEnums() {
    return this.sharedService.getVolunteerEnums();
  }

  // obtiene el perfil de un voluntario por id
  // devuelve un dto con la informacion del voluntario
  async getProfileVolunteer(id: number): Promise<VolunteerResponseDto> {
    return this.sharedService.getProfileVolunteer(id);
  }

  // actualizan voluntarios staff o adviser usando datos raw y archivos
  async updateVolunteerStaffWithRaw(
    id: number,
    body: any,
    file?: Express.Multer.File,
  ) {
    return this.volunteerStaffService.updateVolunteerStaffWithRaw(id, body, file);
  }

  async updateVolunteerAdviserWithRaw(
    id: number,
    body: any,
    file?: Express.Multer.File,
    video?: Express.Multer.File,
  ) {
    return this.volunteerAdviserService.updateVolunteerAdviserWithRaw(id, body, file, video);
  }

  // realiza un borrado lógico de un voluntario
  // devuelve un mensaje de confirmación
  async softDeleteVolunteer(id: number): Promise<{ message: string }> {
    return this.sharedService.softDeleteVolunteer(id);
  }
}
