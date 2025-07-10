import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { JwtRefreshGuard } from '../guards/jwt-refresh.guard';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { ROLE } from 'src/shared/enum/role.enum';
@ApiTags('Auth')
@Controller('auth')
//@UseGuards(JwtAuthGuard)
//@ApiBearerAuth() //candadito
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  //restringir accesso => ADMIN, guard de roles
  @UseGuards(RolesGuard,JwtAuthGuard)
  @Roles(ROLE.ADMIN)
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiResponse({ status: 201, description: 'Login successful' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
  @ApiBearerAuth()
  @Post('refresh')
  refresh(@Body() refreshToken: RefreshTokenDto) {
    return this.authService.refresh(refreshToken.refreshToken);
  }
}
