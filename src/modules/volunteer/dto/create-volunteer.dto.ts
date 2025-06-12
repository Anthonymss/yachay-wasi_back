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
  IsPhoneNumber,
  ValidateIf // Importa ValidateIf
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
  @IsNotEmpty() // Agregado IsNotEmpty para lastName
  lastName: string;

  @IsDateString()
  @IsNotEmpty()
  date_birth: string;

  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber()
  phone_number: string;

  @IsEmail()
  @IsNotEmpty() // Agregado IsNotEmpty para email
  email: string;

  @IsEnum(TYPE_IDENTIFICATION)
  @IsNotEmpty()
  type_identification: TYPE_IDENTIFICATION;

  @IsString()
  @IsNotEmpty()
  num_identification: string;

  @IsOptional()
  @IsBoolean()
  was_voluntary?: boolean;

  @IsOptional()
  @IsUrl() // Validate as a URL
  cv_url?: string;

  // NUEVO CAMPO PARA VIDEO URL
  @IsOptional()
  @IsUrl() // Asumiendo que es una URL una vez subido
  video_url?: string;

  // DISPONIBILIDAD
  // Estos campos son requeridos SOLO si type_volunteer es ADVISER
  @ValidateIf(o => o.type_volunteer === TYPE_VOLUNTEER.ADVISER)
  @IsNotEmpty({ message: 'El grado escolar es requerido para voluntarios de tipo "ADVISER".' })
  @IsEnum(SchoolGrades)
  school_grades?: SchoolGrades; // Usar '?' para indicar que es opcional en el DTO

  @ValidateIf(o => o.type_volunteer === TYPE_VOLUNTEER.ADVISER)
  @IsBoolean({ message: 'El campo "calling_plan" es requerido para voluntarios de tipo "ADVISER".' })
  @IsNotEmpty({ message: 'El campo "calling_plan" es requerido para voluntarios de tipo "ADVISER".' }) // Asegura que no sea undefined/null si es ADVISER
  calling_plan?: boolean;

  // MOTIVACION Y EXPERIENCIA
  @IsBoolean()
  @IsNotEmpty() // experience siempre parece requerido
  experience: boolean;

  @IsEnum(Occupation)
  @IsNotEmpty() // occupation siempre parece requerido
  occupation: Occupation;

  // Estos campos son requeridos SOLO si type_volunteer es ADVISER
  @ValidateIf(o => o.type_volunteer === TYPE_VOLUNTEER.ADVISER)
  @IsString()
  @IsNotEmpty({ message: 'La motivación del voluntariado es requerida para voluntarios de tipo "ADVISER".' })
  @MinLength(10, { message: 'La motivación debe tener al menos 10 caracteres.' }) // Puedes añadir validaciones de longitud si quieres
  @MaxLength(500, { message: 'La motivación no puede exceder los 500 caracteres.' })
  volunteer_motivation?: string;

  @ValidateIf(o => o.type_volunteer === TYPE_VOLUNTEER.ADVISER)
  @IsString()
  @IsNotEmpty({ message: 'La razón para ser asesor es requerida para voluntarios de tipo "ADVISER".' })
  @MinLength(10, { message: 'La razón para ser asesor debe tener al menos 10 caracteres.' })
  @MaxLength(500, { message: 'La razón para ser asesor no puede exceder los 500 caracteres.' })
  why_asesor?: string; // Corregido el nombre a why_asesor para coincidir con la entidad

  @ValidateIf(o => o.type_volunteer === TYPE_VOLUNTEER.ADVISER)
  @IsEnum(QuechuaLevel)
  @IsNotEmpty({ message: 'El nivel de Quechua es requerido para voluntarios de tipo "ADVISER".' })
  quechua_level?: QuechuaLevel;

  @IsEnum(ProgramsUniversity)
  @IsNotEmpty() // programs_university siempre parece requerido
  programs_university: ProgramsUniversity;

  @IsEnum(InfoSource, { message: 'source of information' })
  @IsNotEmpty() // how_did_you_find_us siempre parece requerido
  how_did_you_find_us: InfoSource; // Corregido el nombre a how_did_you_find_us para coincidir con la entidad

  @IsDateString()
  @IsNotEmpty()
  date_postulation: string;

  @IsBoolean()
  @IsNotEmpty()
  is_voluntary: boolean;

  @IsEnum(TYPE_VOLUNTEER)
  @IsNotEmpty() // type_volunteer siempre es requerido
  type_volunteer: TYPE_VOLUNTEER; // Corregido el nombre a type_volunteer para coincidir con la entidad

  @IsOptional() // Suponiendo que puede ser nulo o no enviado si no aplica
  @IsString()
  @IsNotEmpty({ message: 'El nombre del área de postulación es requerido para ciertos tipos de voluntariado.' }) // Si es requerido para ciertos tipos, puedes añadir ValidateIf aquí también
  name_postulation_area?: string; // Corregido el nombre a name_postulation_area
}