/**
 * objeto que contiene todo lo necesario para
 * procesar una postulación completa, que incluye, datos
 * del voluntario (volunteers), horarios disponibles (schedules_volunteers)
 * y respuestas a las preguntas (responses_volunteers)
 */

import { Type } from 'class-transformer';
import {
  IsArray, IsBoolean, IsDateString, IsEmail, IsEnum, IsNotEmpty
  , IsNumber, IsOptional, IsString, ValidateNested
} from 'class-validator';
import { InfoSource, Occupation, ProgramsUniversity, QuechuaLevel, SchoolGrades, TYPE_IDENTIFICATION, TYPE_VOLUNTEER } from '../entities/volunteers.entity';

// Dtos para schedules y questionResponse siguen igual
class QuestionResponseDto {
  @IsNumber()
  questionId: number;
  @IsString()
  @IsNotEmpty()
  reply: string;
}

class ScheduleBlockDto {
  @IsString()
  @IsNotEmpty()
  day_of_week: string;
  @IsString()
  @IsNotEmpty()
  period_time: string;
}

export class CreateApplicationDto {
  /**
   * Datos Personales
   */
  @IsString() 
  @IsNotEmpty() 
  name: string;

  @IsString() 
  @IsNotEmpty() 
  lastname: string;

  @IsDateString()
  date_birth: string;

  @IsString() 
  @IsNotEmpty() 
  phone_number: string;

  @IsEmail() 
  email: string;

  // campos con enum
  @IsEnum(TYPE_IDENTIFICATION)
  @IsNotEmpty() 
  type_identification: TYPE_IDENTIFICATION;

  @IsString() 
  @IsNotEmpty() 
  num_identification: string;

  @IsBoolean() 
  was_voluntary: boolean;

  @IsString() 
  @IsOptional() 
  cv_url ?: string;
  /**
   * Fin Datos Personales
   */

  @IsBoolean() 
  @IsOptional() 
  experience ?: boolean;

  @IsEnum(Occupation) 
  @IsOptional() 
  occupation ?: Occupation;

  @IsString() 
  @IsOptional() 
  volunteer_motivation ?: string;

  @IsString() 
  @IsOptional() 
  why_asesor ?: string;

  @IsEnum(QuechuaLevel)
  @IsOptional() 
  quechua_level ?: QuechuaLevel;

  @IsEnum(ProgramsUniversity)
  @IsOptional() 
  programs_university ?: ProgramsUniversity;

  @IsEnum(InfoSource)
  @IsOptional() 
  how_did_you_find_us ?: InfoSource;

  @IsEnum(SchoolGrades) 
  @IsOptional() 
  school_grades ?: SchoolGrades;

  @IsBoolean() 
  @IsOptional() 
  calling_plan ?: boolean;

  @IsEnum(TYPE_VOLUNTEER) 
  @IsNotEmpty() 
  type_volunteer: TYPE_VOLUNTEER; // 'STAFF' o 'ADVISER'

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScheduleBlockDto)
  schedules: ScheduleBlockDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionResponseDto)
  responses: QuestionResponseDto[];

  @IsNumber()
  subAreaId: number;
}
