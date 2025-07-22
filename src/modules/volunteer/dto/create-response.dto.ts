// create-responde.dto.ts
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEmpty,
  IsOptional,
} from 'class-validator';
import {  } from '../entities/response-volunteer.entity';

export class QuestionResponseDto {
  @IsNumber()
  questionId: number;

  @IsString()
  response: string;
}