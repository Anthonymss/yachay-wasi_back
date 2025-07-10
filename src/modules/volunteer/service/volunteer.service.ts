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
@Injectable()
export class VolunteerService {
  constructor(
    private readonly sharedService: VolunteerSharedService,
    private readonly volunteerStaffService: VolunteerStaffService,
    private readonly volunteerAdviserService: VolunteerAdviserService,
  ) {}

  async createVolunteerStaff(
    dto: CreateVolunteerStaffDto,
    file?: Express.Multer.File,
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

  async findAll(type: TYPE_VOLUNTEER, page = 1, limit = 10) {
    return this.sharedService.findAll(type, page, limit);
  }

  async approveVolunteer(id: number): Promise<{ message: string }> {
    return this.sharedService.approveVolunteer(id);
  }
  async rejectVolunteer(id: number): Promise<{ message: string }> {
    return this.sharedService.rejectVolunteer(id);
  }
  
  async prepareAdviserDto(body: any): Promise<CreateVolunteerAdviserDto> {
    return this.sharedService.prepareAdviserDto(body);
  }

  async getVolunteerEnums() {
    return this.sharedService.getVolunteerEnums();
  }
  async getProfileVolunteer(id: number): Promise<VolunteerResponseDto>{
    return this.sharedService.getProfileVolunteer(id);
  } 
  //update
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

  //soft delete
  async softDeleteVolunteer(id: number): Promise<{ message: string }> {
    return this.sharedService.softDeleteVolunteer(id);
  }
}
