import { PartialType } from '@nestjs/swagger';
import { CreateVolunteerStaffDto } from './create-volunteer-staff.dto';
import { CreateVolunteerAdviserDto } from './create-volunteer-Adviser.dto';

export class UpdateVolunteerStaffDto extends PartialType(CreateVolunteerStaffDto) {}

export class UpdateVolunteerAdviserDto extends PartialType(CreateVolunteerAdviserDto) {}
    