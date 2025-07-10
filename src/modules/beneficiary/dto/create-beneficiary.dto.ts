import { ModalityStudent } from "src/modules/beneficiary/entities/beneficiary.entity";
import { Gender } from "src/modules/beneficiary/entities/beneficiary.entity";
import { Parentesco } from "src/modules/beneficiary/entities/beneficiary.entity";
import { LearningLevel } from "src/modules/beneficiary/entities/beneficiary.entity";
import { CoursePriorityReason } from "src/modules/beneficiary/entities/beneficiary.entity";
import { CallSignalIssue } from "src/modules/beneficiary/entities/beneficiary.entity";
import { WorkshopPreference } from "src/modules/beneficiary/entities/beneficiary.entity";
import { Course } from "src/modules/beneficiary/entities/beneficiary.entity";
import { BeneficiaryLanguage, LANGUAGES } from "src/modules/beneficiary/entities/beneficiary-languaje.entity";
import { BeneficiaryPreferredCourses, PREFERED_COURSES } from "src/modules/beneficiary/entities/beneficiary-preferred-courses.entity";
import { ScheduleDto } from "./schedule.dto.entity";
import { IsNumber, IsNotEmpty, IsString, MaxLength, Matches, IsOptional, IsBoolean, IsArray, IsInt, IsEnum, IsDateString, ValidateNested, Length, ArrayNotEmpty, ArrayUnique } from "class-validator";
import { Type } from "class-transformer";
import { DAY } from "../entities/schedule.entity";
import { ValidateIf } from "class-validator";
import { HttpException } from "@nestjs/common";
export class CreateLanguageDto {
    @IsEnum(LANGUAGES)
    language: LANGUAGES;
  
    @ValidateIf((o) => o.language === LANGUAGES.OTHER)
    @IsString({ message: 'customLanguageName es obligatorio si seleccionas "Otro"' })
    customLanguageName: string;
    
    @ValidateIf((o) => o.language !== LANGUAGES.OTHER && o.customLanguageName !== undefined)
    @IsString({ message: 'customLanguageName solo se permite cuando el idioma es "Otro"' })
    customLanguageNameValidator() {
      throw new HttpException('customLanguageName solo se permite si el idioma es "Otro"', 400);
    }
  }
  
  export class CreatePreferredCourseDto {
    @IsEnum(PREFERED_COURSES)
    name: PREFERED_COURSES;
  
    @ValidateIf((o) => o.name === PREFERED_COURSES.OTROS)
    @IsString({ message: 'customCourseName es obligatorio si seleccionas "Otros"' })
    customCourseName: string;
  
    @ValidateIf((o) => o.name !== PREFERED_COURSES.OTROS && o.customCourseName !== undefined)
    @IsOptional()
    @IsString({ message: 'customCourseName solo se permite si se elige "Otros"' })
    customCourseNameValidator() {
      throw new HttpException('customCourseName solo se permite si el idioma es "Otro"', 400);
    }
  } 

  export class CreateScheduleDto {
    @IsEnum(DAY)
    dayOfWeek: DAY;
  
    @IsString()
    period_time: string;
  
    @IsString()
    period_time2: string;
  
    @IsString()
    period_time3: string;
  }
  
  export class CreateBeneficiaryDto {
    @IsString()
    @Length(1, 50)
    code: string;
    @IsString()
    @Length(1, 50)
    name: string;
  
    @IsString()
    @Length(1, 50)
    lastName: string;
  
    @IsString()
    @Length(8, 30)
    dni: string;
  
    @IsOptional()
    @IsString()
    @Length(0, 150)
    institution?: string;
  
    @IsOptional()
    @IsEnum(ModalityStudent)
    modalityStudent?: ModalityStudent;
  
    @IsOptional()
    @IsDateString()
    birthDate?: string;
  
    @IsOptional()
    @IsEnum(Gender)
    gender?: Gender;
  
    @IsOptional()
    @IsEnum(Parentesco)
    parentesco?: Parentesco;
  
    @IsOptional()
    @IsString()
    nameRepresentative?: string;
  
    @IsOptional()
    @IsString()
    lastNameRepresentative?: string;
  
    @IsOptional()
    @IsBoolean()
    isAddGroupWspp?: boolean;
  
    @IsOptional()
    @IsBoolean()
    isAddEquipment?: boolean;
  
    @IsOptional()
    @IsEnum(LearningLevel)
    learningLevel?: LearningLevel;
  
    @IsOptional()
    @IsInt()
    hoursAsesoria?: number;
  
    @IsOptional()
    @IsEnum(CoursePriorityReason)
    coursePriorityReason?: CoursePriorityReason;
  
    @IsOptional()
    phoneNumberMain?: string;
  
    @IsOptional()
    @IsString()
    cellphoneObservation?: string;
  
    @IsOptional()
    @IsBoolean()
    isWhatsApp?: boolean;
  
    @IsOptional()
    @IsEnum(CallSignalIssue)
    callSignalIssue?: CallSignalIssue;
  
    @IsOptional()
    @IsString()
    fullNameContactEmergency?: string;
  
    @IsOptional()
    phoneNumberContactEmergency?: string;
  
    @IsOptional()
    @IsString()
    fullNameContactEmergency2?: string;
  
    @IsOptional()
    phoneNumberContactEmergency2?: string;
  
    @IsBoolean()
    allpaAdvisoryConsent: boolean;
  
    @IsBoolean()
    allpaImageConsent: boolean;
  
    @IsBoolean()
    ruruAdvisoryConsent: boolean;
  
    @IsOptional()
    @IsString()
    additionalNotes?: string;
  
    @IsOptional()
    @IsEnum(WorkshopPreference)
    firstWorkshopChoice?: WorkshopPreference;
  
    @IsOptional()
    @IsEnum(WorkshopPreference)
    secondWorkshopChoice?: WorkshopPreference;
  
    @IsOptional()
    @IsEnum(WorkshopPreference)
    thirdWorkshopChoice?: WorkshopPreference;
  
    @IsOptional()
    @IsEnum(Course)
    firstCourseChoice?: Course;
  
    @IsOptional()
    @IsEnum(Course)
    secondCourseChoice?: Course;
  
    // Relaciones
    @IsOptional()
    @IsInt()
    userId?: number;
  
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateLanguageDto)
    beneficiaryLanguage: CreateLanguageDto[];
  
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreatePreferredCourseDto)
    beneficiaryPreferredCourses: CreatePreferredCourseDto[];
  
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateScheduleDto)
    schedule: CreateScheduleDto[];
  
    @IsArray()
    @ArrayUnique({ message: 'Las preferencias de comunicación no pueden repetirse' })
    @IsInt({ each: true, message: 'Cada ID de preferencia debe ser un número válido' })
    communicationPreferences: number[]; 
  
    @IsArray()
    @IsInt({ each: true })
    @ArrayUnique({ message: 'Las áreas asesoras no deben repetirse' })
    @IsOptional()
    areaAdvisers?: number[];
  }