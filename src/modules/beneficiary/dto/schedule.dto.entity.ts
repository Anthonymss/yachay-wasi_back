import { IsEnum, IsOptional, IsString } from "class-validator";
import { DAY } from "../entities/schedule.entity";
    export class ScheduleDto {
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