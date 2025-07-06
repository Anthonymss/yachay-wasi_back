import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from 'src/modules/user/user.service';
import { User } from 'src/modules/user/entities/user.entity';
import { Rol } from 'src/modules/user/entities/rol.entity';
import { MailService } from 'src/shared/mail/mail.service';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let userRepo: jest.Mocked<Repository<User>>;
  let rolRepo: jest.Mocked<Repository<Rol>>;
  let mailService: MailService;

  beforeEach(async () => {
    userRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
    } as any;

    rolRepo = {
      findOne: jest.fn(),
    } as any;

    mailService = {
      sendTemplate: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: userRepo },
        { provide: getRepositoryToken(Rol), useValue: rolRepo },
        { provide: MailService, useValue: mailService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const dto = { name: 'Juan', email: 'juan@test.com' } as any;
      userRepo.create.mockReturnValue(dto);
      userRepo.save.mockResolvedValue({ ...dto, id: 1 });

      const result = await service.create(dto);
      expect(userRepo.create).toHaveBeenCalledWith(dto);
      expect(userRepo.save).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ ...dto, id: 1 });
    });
  });

  describe('createAuth', () => {
    it('should create user with role', async () => {
      const dto = {
        name: 'Ana',
        email: 'ana@test.com',
        rolName: 'Admin',
      } as any;

      const role = { id: 1, name: 'Admin', description: 'Admin' };
      rolRepo.findOne.mockResolvedValue(role);
      userRepo.create.mockReturnValue({ ...dto });
      userRepo.save.mockResolvedValue({ ...dto, id: 2 });

      const result = await service.createAuth(dto);
      expect(rolRepo.findOne).toHaveBeenCalledWith({ where: { name: 'Admin' } });
      expect(userRepo.create).toHaveBeenCalledWith(dto);
      expect(userRepo.save).toHaveBeenCalled();
      expect(result).toEqual({ ...dto, id: 2 });
    });

    it('should throw if role not found', async () => {
      rolRepo.findOne.mockResolvedValue(null);
      await expect(service.createAuth({ rolName: 'Desconocido' } as any)).rejects.toThrow('Role not found');
    });
  });

  describe('resetPassword', () => {
    it('should reset the password', async () => {
      const user = { email: 'test@test.com', password: 'old' } as any;
      userRepo.findOne.mockResolvedValue(user);
      jest.spyOn(jwt, 'verify').mockReturnValue({ email: user.email } as any);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');

      const result = await service.resetPassword('valid.token', 'newPassword');
      expect(userRepo.save).toHaveBeenCalledWith({ ...user, password: 'hashedPassword' });
      expect(result).toEqual({ message: 'Contraseña actualizada correctamente' });
    });

    it('should throw if token invalid', async () => {
      jest.spyOn(jwt, 'verify').mockImplementation(() => {
        throw new Error('Invalid');
      });
      await expect(service.resetPassword('invalid.token', 'pass')).rejects.toThrow(BadRequestException);
    });
  });

  describe('sendResetPasswordEmail', () => {
    it('should send reset email', async () => {
      const user = { email: 'test@test.com', name: 'Test' } as any;
      userRepo.findOne.mockResolvedValue(user);
      const token = 'mock.token';
      jest.spyOn(jwt, 'sign').mockImplementation(jest.fn(() => 'mock.token'));

      const result = await service.sendResetPasswordEmail({ email: user.email });
      expect(mailService.sendTemplate).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Correo de recuperación enviado' });
    });

    it('should throw if user not found', async () => {
      userRepo.findOne.mockResolvedValue(null);
      await expect(service.sendResetPasswordEmail({ email: 'x@x.com' })).rejects.toThrow(NotFoundException);
    });
  });
  it('should create a user with provided data', async () => {
    const dto = {
      name: 'Test',
      lastName: 'User',
      email: 'test@mail.com',
      password: 'hashed',
      phoneNumber: '123',
    } as User;
  
    const mockUser: User = {
      ...dto,
      id: 1,
      rol: { id: 1, name: 'Admin', description: 'admin' }, 
      createdAt: new Date(),
      updatedAt: new Date(),
      beneficiaries: [],
      refreshTokens: [],
    };
  
    userRepo.create!.mockReturnValue(dto);
    userRepo.save!.mockResolvedValue(mockUser);
  
    const result = await service.create(dto);
    expect(userRepo.create).toHaveBeenCalledWith(dto);
    expect(userRepo.save).toHaveBeenCalledWith(dto);
    expect(result.id).toBe(1);
  });
  
  it('should create a user with role', async () => {
    const dto = {
      name: 'Ana',
      email: 'ana@mail.com',
      password: '123',
      phoneNumber: '987',
      rolName: 'Admin',
    };
  
    const mockRol: Rol = {
      id: 1,
      name: 'Admin',
      description: 'admin role',
    };
  
    const userWithRole = {
      id: 1,
      name: dto.name,
      lastName: 'TestLastName',
      email: dto.email,
      password: dto.password,
      phoneNumber: dto.phoneNumber,
      rol: mockRol,
      createdAt: new Date(),
      updatedAt: new Date(),
      beneficiaries: [],
      refreshTokens: [],
    } as unknown as User;
  
    rolRepo.findOne!.mockResolvedValue(mockRol);
    userRepo.create!.mockReturnValue(userWithRole);
    userRepo.save!.mockResolvedValue(userWithRole);
  
    const result = await service.createAuth(dto as any);
    expect(result.rol).toEqual(mockRol);
    expect(result.id).toBe(1);
  });
  

  it('should throw error if role is not found', async () => {
    const dto = {
      name: 'Ana',
      email: 'ana@mail.com',
      password: '123',
      phoneNumber: '987',
      rolName: 'Invalido',
    };

    rolRepo.findOne!.mockResolvedValue(null);

    await expect(service.createAuth(dto as any)).rejects.toThrow('Role not found');
  });

    
});
