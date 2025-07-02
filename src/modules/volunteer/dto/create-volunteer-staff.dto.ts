import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { InfoSource, TYPE_IDENTIFICATION } from '../entities/volunteer.entity';
import { Transform } from 'class-transformer';
export class CreateVolunteerStaffDto {
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

  @IsString()
  volunteerMotivation: string;
  @IsEnum(InfoSource, {
    message: `howDidYouFindUs debe ser uno de: ${Object.values(InfoSource).join(', ')}`,
  })
  howDidYouFindUs: InfoSource;

  //que subarea va a postular, se guarda el name porque no hay referencia directa
  @IsNotEmpty()
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  idPostulationArea: number;
}
