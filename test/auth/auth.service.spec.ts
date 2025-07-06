import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/modules/auth/service/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from 'src/modules/user/user.service';
import { RefreshToken } from 'src/modules/user/entities/refresh-token.entity';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from 'src/modules/user/entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let userService: Partial<Record<keyof UserService, jest.Mock>>;
  let jwtService: Partial<Record<keyof JwtService, jest.Mock>>;
  let configService: Partial<Record<keyof ConfigService, jest.Mock>>;
  let refreshTokenRepo: any;

  beforeEach(async () => {
    userService = {
      findByEmail: jest.fn(),
      createAuth: jest.fn(),
      findById: jest.fn(),
    };

    jwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
      decode: jest.fn(),
    };

    configService = {
      get: jest.fn((key: string) => {
        const configMap = {
          JWT_ACCESS_SECRET: 'access-secret',
          JWT_REFRESH_SECRET: 'refresh-secret',
          JWT_ACCESS_TOKEN_EXPIRES_IN: '1h',
          JWT_REFRESH_TOKEN_EXPIRES_IN: '7d',
        };
        return configMap[key];
      }),
    };

    refreshTokenRepo = {
      create: jest.fn(),
      save: jest.fn().mockResolvedValue(undefined),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
        { provide: UserService, useValue: userService },
        { provide: getRepositoryToken(RefreshToken), useValue: refreshTokenRepo },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should throw if user already exists', async () => {
      userService.findByEmail!.mockResolvedValue({ id: 1 });
      await expect(service.register({ email: 'test@test.com', password: '123' } as any))
        .rejects
        .toThrow(UnauthorizedException);
    });

    it('should create user if not exists', async () => {
      userService.findByEmail!.mockResolvedValue(null);
      userService.createAuth!.mockResolvedValue({});
      const result = await service.register({ email: 'test@test.com', password: '123' } as any);
      expect(result).toBe('User created successfully');
      expect(userService.createAuth).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should throw if credentials are invalid', async () => {
      jest.spyOn(service as any, 'validateUser').mockResolvedValue(null);
      await expect(service.login({ email: 'fail@test.com', password: 'bad' } as any))
        .rejects
        .toThrow(UnauthorizedException);
    });

    it('should return tokens and user if valid', async () => {
      const user = { id: 1, email: 'ok@test.com', name: 'John', lastName: 'Doe', rol: { name: 'admin' } } as User;
      jest.spyOn(service as any, 'validateUser').mockResolvedValue(user);
      jest.spyOn(service as any, 'generateTokens').mockResolvedValue({
        accessToken: 'access',
        refreshToken: 'refresh',
        tokenEntity: {},
      });

      const result = await service.login({ email: 'ok@test.com', password: '123' } as any);
      expect(result).toEqual({
        accessToken: 'access',
        refreshToken: 'refresh',
        user: {
          id: 1,
          email: 'ok@test.com',
          name: 'John',
          lastName: 'Doe',
          role: 'admin',
        },
      });
    });
  });

  describe('refresh', () => {
    it('should throw if no valid refresh token', async () => {
      jwtService.verify!.mockReturnValue({ sub: 1 });
      userService.findById!.mockResolvedValue({ id: 1 });
      refreshTokenRepo.findOne.mockResolvedValue(null);

      await expect(service.refresh('some-token')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw if refresh token doesn’t match', async () => {
      jwtService.verify!.mockReturnValue({ sub: 1 });
      userService.findById!.mockResolvedValue({ id: 1 });
      refreshTokenRepo.findOne.mockResolvedValue({ token: 'hashed', isRevoked: false });
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(service.refresh('wrong-token')).rejects.toThrow(UnauthorizedException);
    });

    it('should generate new tokens if valid', async () => {
      jwtService.verify!.mockReturnValue({ sub: 1 });
      userService.findById!.mockResolvedValue({ id: 1 });
      refreshTokenRepo.findOne.mockResolvedValue({ token: 'hashed', isRevoked: false });
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      jest.spyOn(service as any, 'generateTokens').mockResolvedValue({
        accessToken: 'new-access',
        refreshToken: 'new-refresh',
        tokenEntity: {},
      });

      const result = await service.refresh('valid-token');
      expect(result).toEqual({
        accessToken: 'new-access',
        refreshToken: 'new-refresh',
      });
    });
  });
});
