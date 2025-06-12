import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsDateString,
  MinLength,
  MaxLength,
  IsUrl,
  IsPhoneNumber
} from 'class-validator';
import {
  InfoSource,
  Occupation,
  ProgramsUniversity,
  QuechuaLevel,
  SchoolGrades,
  TYPE_IDENTIFICATION,
  TYPE_VOLUNTEER,
} from '../entities/volunteers.entity';

// VALIDACIONES
export class CreateVolunteerDto {
  // datos personales
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @IsString()
  lastName: string;

  @IsDateString() // Use IsDateString for date_birth
  @IsNotEmpty()
  date_birth: string;

  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber()
  phone_number: string;

  @IsEmail()
  email: string;

  @IsEnum(TYPE_IDENTIFICATION)
  @IsNotEmpty()
  type_identification: TYPE_IDENTIFICATION; // Changed from typeIdentification to match table

  @IsString()
  @IsNotEmpty()
  num_identification: string; // Changed from numIdentification to match table

  @IsOptional()
  @IsBoolean()
  was_voluntary?: boolean;

  @IsOptional()
  @IsUrl() // Validate as a URL
  cv_url?: string;

  // DISPONIBILIDAD
  @IsEnum(SchoolGrades)
  school_grades: SchoolGrades;

  @IsBoolean()
  calling_plan?: boolean;

  // MOTIVACION Y EXPERIENCIA
  @IsBoolean()
  experience: boolean;

  @IsEnum(Occupation)
  occupation: Occupation; // New field from table

  @IsString()
  @IsNotEmpty()
  volunteer_motivation: string;

  @IsOptional() // Assuming whyAsesor might be optional
  @IsString()
  whyAsesor?: string; // New field from table

  @IsOptional() // Assuming quechua_level might be optional
  @IsEnum(QuechuaLevel)
  quechua_level?: QuechuaLevel; // New field from table

  @IsEnum(ProgramsUniversity)
  programs_university: ProgramsUniversity; // New field from table

  @IsEnum(InfoSource, { message: 'source of information' })
  howDidYouFindUs: InfoSource;

  @IsDateString()
  @IsNotEmpty()
  date_postulation: string; 

  @IsBoolean()
  @IsNotEmpty()
  is_voluntary: boolean;

  @IsEnum(TYPE_VOLUNTEER)
  typeVolunteer: TYPE_VOLUNTEER;

  /*  //que subarea va a postular
    @IsNotEmpty()
    namePostulationArea: string;*/

}
