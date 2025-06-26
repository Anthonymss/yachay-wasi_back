import {
  Injectable,
  UnauthorizedException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/modules/user/user.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { User } from 'src/modules/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from 'src/modules/user/entities/refresh-token.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UserService,
    private readonly config: ConfigService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepo: Repository<RefreshToken>,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) throw new UnauthorizedException('User already exists');

    const hashed = await bcrypt.hash(dto.password, 10);
    await this.usersService.createAuth({
      ...dto,
      password: hashed,
    });
    return 'user created successfully';
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.email, dto.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const response = await this.generateTokens(user);
    return {
      ...response,
      user: {
        id: user.id,
        email: user.email,
        role: user.rol?.name,
      },
    };
  }

  async refresh(refreshToken: string) {
    const payload = this.jwtService.verify(refreshToken, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
    });

    const user = await this.usersService.findById(payload.sub, true);
    if (!user) throw new UnauthorizedException('User not found');

    const latestToken = await this.refreshTokenRepo.findOne({
      where: { user: { id: user.id }, isRevoked: false },
      order: { createdAt: 'DESC' },
    });
    if (!latestToken) {
      throw new UnauthorizedException('No valid refresh token found');
    }
    const match = await bcrypt.compare(refreshToken, latestToken.token);
    if (!match) {
      throw new UnauthorizedException('Refresh token inválido');
    }
    latestToken.isRevoked = true;
    await this.refreshTokenRepo.save(latestToken);

    return this.generateTokens(user);
  }

  private async generateTokens(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.rol?.name,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.config.get('JWT_ACCESS_SECRET'),
      expiresIn: this.config.get('JWT_ACCESS_TOKEN_EXPIRES_IN'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get('JWT_REFRESH_TOKEN_EXPIRES_IN'),
    });

    const expiry = this.jwtService.decode(refreshToken)['exp'];
    const expiresAt = new Date(expiry * 1000);

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    const tokenEntity = this.refreshTokenRepo.create({
      token: hashedRefreshToken,
      user,
      expiresAt,
    });

    await this.refreshTokenRepo.save(tokenEntity);

    return { accessToken, refreshToken };
  }

  private async validateUser(
    email: string,
    pass: string,
  ): Promise<User | null> {
    const user = await this.usersService.findByEmail(email, true);
    if (user && (await bcrypt.compare(pass, user.password))) {
      return user;
    }
    return null;
  }
}
