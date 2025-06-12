import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEmpty,
  IsOptional,
} from 'class-validator';
import { DAY } from '../entities/schedule.entity';

export class CreateScheduleDto {
  @IsEnum(DAY)
  dayOfWeek: DAY;

  @IsOptional()
  @IsString()
  period_time?: string;

  @IsOptional()
  @IsString()
  period_time2?: string;

  @IsOptional()
  @IsString()
  period_time3?: string;
}
