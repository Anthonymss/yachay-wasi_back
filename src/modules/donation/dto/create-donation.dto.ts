import { IsString, IsNumber, IsEnum, IsOptional, IsBoolean, IsUrl } from 'class-validator';
import { PaymentMethod } from '../interfaces/payment.strategy';
import { Transform } from 'class-transformer';

export class CreateDonationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsNumber()
  amount: number;

  @IsString()
  currency: string;

  @IsString()
  donationType: string;

  @IsOptional()
  @IsString()
  message?: string;
  
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  is_anonymous: boolean;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;
}