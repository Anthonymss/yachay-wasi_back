import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @IsNotEmpty()
  @ApiProperty({ default: 'your-refresh-token-here' })
  refreshToken: string;
}
