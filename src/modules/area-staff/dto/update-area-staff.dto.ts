import { PartialType } from '@nestjs/swagger';
import { CreateAreaStaffDto } from './create-area-staff.dto';

export class UpdateAreaStaffDto extends PartialType(CreateAreaStaffDto) {}
