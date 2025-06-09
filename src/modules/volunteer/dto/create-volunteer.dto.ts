import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import {
  InfoSource,
  TYPE_IDENTIFICATION,
  TYPE_VOLUNTEER,
} from '../entities/volunteer.entity';

export class CreateVolunteerDto {
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

  @IsOptional()
  @IsBoolean()
  wasVoluntary?: boolean;
  @IsString()
  volunteerMotivation: string;
  @IsEnum(InfoSource, { message: 'source of information' })
  howDidYouFindUs: InfoSource;
  @IsEnum(TYPE_VOLUNTEER)
  typeVolunteer: TYPE_VOLUNTEER;
  //que subarea va a postular
  @IsNotEmpty()
  namePostulationArea:string;
  
}
