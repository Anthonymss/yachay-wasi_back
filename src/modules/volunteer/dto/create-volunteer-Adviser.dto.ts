import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsDateString,
  IsNumber,
  isNotEmpty,
  ValidateNested,
  ArrayMinSize,
  IsArray,
} from 'class-validator';
import { InfoSource, TYPE_IDENTIFICATION } from '../entities/volunteer.entity';
import { Transform, Type } from 'class-transformer';
import { CreateScheduleDto } from './create-schedule.dto';
export class CreateVolunteerADdviserDto {
  @IsString()
  name: string;

  @IsString()
  lastName: string;

  @IsString()
  birthDate: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsEmail()
  email: string;

  @IsEnum(TYPE_IDENTIFICATION)
  typeIdentification: TYPE_IDENTIFICATION;

  @IsString()
  numIdentification: string;

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  wasVoluntary: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateScheduleDto)
  schedule: CreateScheduleDto[];

  @IsString()
  volunteerMotivation: string;
  @IsEnum(InfoSource, { message: 'source of information' })
  howDidYouFindUs: InfoSource;
  //que subarea va a postular
  @IsNotEmpty()
  namePostulationArea: string;
}
