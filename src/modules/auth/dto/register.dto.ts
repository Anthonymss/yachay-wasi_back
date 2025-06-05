import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  lastName: string;
  @IsNotEmpty()
  phoneNumber: string;
  @IsEmail()
  email: string;
  @MinLength(6)
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  @ApiProperty({ default: 'Yakus_staff' })
  rolName: string;

  //sub area staff
}
