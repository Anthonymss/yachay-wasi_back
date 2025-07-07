import {
  Injectable,
  UnauthorizedException,
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
    return 'User created successfully';
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.email, dto.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const { accessToken, refreshToken, tokenEntity } = await this.generateTokens(user);

    // Guardado asincrónico del refreshToken
    this.refreshTokenRepo.save(tokenEntity).catch((err) => {
      console.error('Failed to save refresh token', err);
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.rol?.name,
        name: user.name,
        lastName: user.lastName,
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
    if (!latestToken) throw new UnauthorizedException('No valid refresh token found');

    const match = await bcrypt.compare(refreshToken, latestToken.token);
    if (!match) throw new UnauthorizedException('Invalid refresh token');

    latestToken.isRevoked = true;
    await this.refreshTokenRepo.save(latestToken);

    const { accessToken, refreshToken: newToken, tokenEntity } = await this.generateTokens(user);

    // Guardar el nuevo token asincrónicamente
    this.refreshTokenRepo.save(tokenEntity).catch((err) => {
      console.error('Failed to save refresh token', err);
    });

    return { accessToken, refreshToken: newToken };
  }

  private async generateTokens(user: User) {
    const payload = {
      sub: user.id,
      id: user.id,
      name: user.name,
      lastName: user.lastName,
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

    return { accessToken, refreshToken, tokenEntity };
  }

  private async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email, true);
    if (user && (await bcrypt.compare(pass, user.password))) {
      return user;
    }
    return null;
  }
}
