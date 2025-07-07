import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsEnum,
  IsBoolean,
  ValidateNested,
  IsArray,
  IsNumber,
  IsOptional,
} from 'class-validator';
import {
  InfoSource,
  ProgramsUniversity,
  QuechuaLevel,
  SchoolGrades,
  TYPE_IDENTIFICATION,
} from '../entities/volunteer.entity';
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

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  experience: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateScheduleDto)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return [];
      }
    }
    return value;
  })
  schedule: CreateScheduleDto[];

  @IsString()
  volunteerMotivation: string;
  @IsEnum(InfoSource, {
    message: `howDidYouFindUs debe ser uno de: ${Object.values(InfoSource).join(', ')}`,
  })
  howDidYouFindUs: InfoSource;
  @IsNotEmpty()
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  idPostulationArea: number;

  //others
  @IsOptional()
  @IsNumber({}, { message: 'advisoryCapacity debe ser un número' })
  @Transform(({ value }) => {
    const val = Number(value);
    return isNaN(val) ? undefined : val;
  })
  advisoryCapacity?: number;

  @IsEnum(SchoolGrades)
  schoolGrades?: SchoolGrades;

  @IsEnum(QuechuaLevel)
  quechuaLevel?: QuechuaLevel;

  @IsEnum(ProgramsUniversity)
  programsUniversity?: ProgramsUniversity;

  @IsArray()
  @IsOptional()
  responses?: { questionId: number; reply: string }[];
}
