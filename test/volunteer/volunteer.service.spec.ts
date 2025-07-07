import { Test, TestingModule } from '@nestjs/testing';
import { VolunteerService } from 'src/modules/volunteer/service/volunteer.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Volunteer } from 'src/modules/volunteer/entities/volunteer.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { MailService } from 'src/shared/mail/mail.service';
import { S3Service } from 'src/shared/s3/S3.service';
import { BadRequestException } from '@nestjs/common';

describe('VolunteerService', () => {
  let service: VolunteerService;
  let volunteerRepo: any;
  let userRepo: any;
  let mailService: any;
  let s3Service: any;

  beforeEach(async () => {
    volunteerRepo = {
      create: jest.fn().mockImplementation((data) => data),
      save: jest.fn().mockResolvedValue({
        id: 1,
        name: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        typeVolunteer: 'STAFF',
        datePostulation: new Date(),
      }),
      findOne: jest.fn().mockResolvedValue(null),
      manager: {
        getRepository: jest.fn().mockReturnValue({
          save: jest.fn().mockResolvedValue([]),
        }),
      },
    };

    userRepo = {
      manager: { transaction: jest.fn() },
    };

    mailService = {
      sendTemplate: jest.fn(),
    };

    s3Service = {
      uploadFile: jest.fn().mockResolvedValue('https://s3.fake/file.pdf'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VolunteerService,
        { provide: getRepositoryToken(Volunteer), useValue: volunteerRepo },
        { provide: getRepositoryToken(User), useValue: userRepo },
        { provide: MailService, useValue: mailService },
        { provide: S3Service, useValue: s3Service },
      ],
    }).compile();

    service = module.get<VolunteerService>(VolunteerService);
  });

  describe('createVolunteerStaff', () => {
    const dto = {
      name: 'Juan',
      lastName: 'Pérez',
      birthDate: '1990-01-01',
      phoneNumber: '987654321',
      email: 'juan@example.com',
      typeIdentification: 'DNI',
      numIdentification: '12345678',
      wasVoluntary: true,
      volunteerMotivation: 'Quiero ayudar',
      howDidYouFindUs: 'Facebook',
      idPostulationArea: 1,
    };

    const mockFile = {
      mimetype: 'application/pdf',
      originalname: 'cv.pdf',
      buffer: Buffer.from('mock pdf'),
    };

    it('should throw if no file is provided', async () => {
      await expect(service.createVolunteerStaff(dto as any, undefined))
        .rejects
        .toThrow(BadRequestException);
    });

    it('should create a volunteer staff successfully', async () => {
      const result = await service.createVolunteerStaff(dto as any, mockFile as any);

      expect(volunteerRepo.create).toHaveBeenCalled();
      expect(volunteerRepo.save).toHaveBeenCalled();
      expect(s3Service.uploadFile).toHaveBeenCalledWith(mockFile);
      expect(mailService.sendTemplate).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe('createVolunteerAdviser', () => {
    it('should create an adviser with valid files', async () => {
      volunteerRepo.findOne.mockResolvedValue(null);

      const dto = {
        name: 'Ana',
        lastName: 'Gómez',
        email: 'ana@example.com',
        schedule: [],
        numIdentification: '12345678',
        idPostulationArea: 1,
        wasVoluntary: true,
      };

      const file = {
        mimetype: 'application/pdf',
        originalname: 'cv.pdf',
        buffer: Buffer.from('pdf'),
      };
      const video = {
        mimetype: 'video/mp4',
        originalname: 'intro.mp4',
        buffer: Buffer.from('video'),
      };

      const result = await service.createVolunteerAdviser(dto as any, file as any, video as any);

      expect(result).toBeDefined();
      expect(s3Service.uploadFile).toHaveBeenCalledTimes(2);
      expect(mailService.sendTemplate).toHaveBeenCalled();
      expect(volunteerRepo.save).toHaveBeenCalled();
      expect(volunteerRepo.manager.getRepository).toHaveBeenCalled();
    });
  });

  describe('approveVolunteer', () => {
    const mockVolunteer = {
      id: 1,
      name: 'Pedro',
      lastName: 'Sánchez',
      email: 'pedro@example.com',
      numIdentification: '12345678',
      phoneNumber: '987654321',
      idPostulationArea: 1,
      typeVolunteer: 'STAFF',
      isVoluntary: false,
      statusVolunteer: 'PENDING',
    };
  
    it('should approve a volunteer and create user if type is STAFF', async () => {
      const mockSave = jest.fn();
      const mockCreate = jest.fn().mockImplementation((data) => data);
      const mockTransaction = jest.fn().mockImplementation(async (cb) => {
        await cb({ create: mockCreate, save: mockSave });
      });
  
      volunteerRepo.findOne.mockResolvedValue({ ...mockVolunteer });
      userRepo.manager.transaction = mockTransaction;
  
      const result = await service.approveVolunteer(1);
  
      expect(volunteerRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockTransaction).toHaveBeenCalled();
      expect(mockCreate).toHaveBeenCalled();
      expect(mockSave).toHaveBeenCalledTimes(2); // user y volunteer
      expect(mailService.sendTemplate).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Voluntario aprobado correctamente' });
    });
  
    it('should throw if volunteer does not exist', async () => {
      volunteerRepo.findOne.mockResolvedValue(null);
  
      await expect(service.approveVolunteer(999)).rejects.toThrow('Voluntario no encontrado');
    });
  
    it('should throw if volunteer is already approved and isVoluntary', async () => {
      volunteerRepo.findOne.mockResolvedValue({
        ...mockVolunteer,
        isVoluntary: true,
        statusVolunteer: 'APPROVED',
      });
  
      await expect(service.approveVolunteer(1)).rejects.toThrow(
        'El voluntario ya es un usuario, y esta aprobado',
      );
    });
  
    it('should throw BadRequestException on transaction error', async () => {
      const error = new Error('fallo forzado');
      volunteerRepo.findOne.mockResolvedValue({ ...mockVolunteer });
      userRepo.manager.transaction = jest.fn().mockImplementation(async () => {
        throw error;
      });
  
      await expect(service.approveVolunteer(1)).rejects.toThrow('Error al aprobar voluntario: fallo forzado');
    });
  });
  describe('rejectVolunteer', () => {
    const mockVolunteer = {
      id: 2,
      statusVolunteer: 'PENDING',
      isVoluntary: true,
    };
  
    it('should reject a volunteer successfully', async () => {
      volunteerRepo.findOne.mockResolvedValue(mockVolunteer);
      volunteerRepo.save.mockResolvedValue({ ...mockVolunteer, statusVolunteer: 'REJECTED', isVoluntary: false });
  
      const result = await service.rejectVolunteer(2);
  
      expect(volunteerRepo.findOne).toHaveBeenCalledWith({ where: { id: 2 } });
      expect(volunteerRepo.save).toHaveBeenCalledWith({
        ...mockVolunteer,
        statusVolunteer: 'REJECTED',
        isVoluntary: false,
      });
      expect(result).toEqual({ message: 'Voluntario rechazado correctamente' });
    });
  
    it('should throw if volunteer does not exist', async () => {
      volunteerRepo.findOne.mockResolvedValue(null);
  
      await expect(service.rejectVolunteer(2)).rejects.toThrow('Voluntario no encontrado');
    });
  
    it('should throw if volunteer is already rejected', async () => {
      volunteerRepo.findOne.mockResolvedValue({ ...mockVolunteer, statusVolunteer: 'REJECTED' });
  
      await expect(service.rejectVolunteer(2)).rejects.toThrow('El voluntario ya fue rechazado');
    });
  });
  it('should throw NotFoundException if volunteer does not exist', async () => {
    volunteerRepo.findOne.mockResolvedValue(null);
    await expect(service.approveVolunteer(999)).rejects.toThrow('Voluntario no encontrado');
  });
  it('should throw if volunteer is already approved and is user', async () => {
    volunteerRepo.findOne.mockResolvedValue({
      id: 1,
      isVoluntary: true,
      statusVolunteer: 'APPROVED',
    });
    await expect(service.approveVolunteer(1)).rejects.toThrow('El voluntario ya es un usuario, y esta aprobado');
  });
  it('should approve a volunteer successfully', async () => {
    const mockVolunteer = {
      id: 1,
      name: 'Ana',
      lastName: 'López',
      email: 'ana@example.com',
      numIdentification: '12345678',
      phoneNumber: '987654321',
      typeVolunteer: 'STAFF',
      statusVolunteer: 'PENDING',
      isVoluntary: false,
      idPostulationArea: 1,
    };
  
    const saveMock = jest.fn();
    userRepo.manager.transaction.mockImplementation(async (callback) =>
      callback({ create: jest.fn().mockReturnValue({}), save: saveMock }),
    );
  
    volunteerRepo.findOne.mockResolvedValue(mockVolunteer);
  
    const res = await service.approveVolunteer(1);
  
    expect(res.message).toBe('Voluntario aprobado correctamente');
    expect(mailService.sendTemplate).toHaveBeenCalled();
  });
  it('should throw if volunteer is not found on reject', async () => {
    volunteerRepo.findOne.mockResolvedValue(null);
    await expect(service.rejectVolunteer(1)).rejects.toThrow('Voluntario no encontrado');
  });
  it('should throw if volunteer is already rejected', async () => {
    volunteerRepo.findOne.mockResolvedValue({ statusVolunteer: 'REJECTED' });
    await expect(service.rejectVolunteer(1)).rejects.toThrow('El voluntario ya fue rechazado');
  });
  it('should reject volunteer successfully', async () => {
    const mockVolunteer = { statusVolunteer: 'PENDING', isVoluntary: true };
    volunteerRepo.findOne.mockResolvedValue(mockVolunteer);
    volunteerRepo.save.mockResolvedValue(mockVolunteer);
  
    const res = await service.rejectVolunteer(1);
  
    expect(res.message).toBe('Voluntario rechazado correctamente');
    expect(volunteerRepo.save).toHaveBeenCalledWith({
      statusVolunteer: 'REJECTED',
      isVoluntary: false,
    });
  });
  it('should return all enum values', async () => {
    const res = await service.getVolunteerEnums();
  
    expect(res).toHaveProperty('typeIdentification');
    expect(res).toHaveProperty('infoSource');
    expect(res).toHaveProperty('quechuaLevel');
    expect(res).toHaveProperty('schoolGrades');
    expect(res).toHaveProperty('programsUniversity');
    expect(res).toHaveProperty('dayOfWeek');
  });
            
    
});
