import { PartialType } from '@nestjs/swagger';
import { CreateVolunteerStaffDto } from './create-volunteer-staff.dto';

export class UpdateVolunteerDto extends PartialType(CreateVolunteerStaffDto) {}
