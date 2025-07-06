import { Test, TestingModule } from '@nestjs/testing';
import { BeneficiaryService } from 'src/modules/beneficiary/service/beneficiary.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Beneficiary } from 'src/modules/beneficiary/entities/beneficiary.entity';
import { BeneficiaryLanguage, LANGUAGES } from 'src/modules/beneficiary/entities/beneficiary-languaje.entity';
import { BeneficiaryPreferredCourses, PREFERED_COURSES } from 'src/modules/beneficiary/entities/beneficiary-preferred-courses.entity';
import { CommunicationPreference } from 'src/modules/beneficiary/entities/communication-preference.entity';
import { Schedule } from 'src/modules/beneficiary/entities/schedule.entity';
import { AreaAdviser } from 'src/modules/area/entities/area-beneficiary/area-adviser.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('BeneficiaryService', () => {
  let service: BeneficiaryService;
  let beneficiaryRepo: jest.Mocked<Repository<Beneficiary>>;
  let userRepo: jest.Mocked<Repository<User>>;
  let langRepo: jest.Mocked<Repository<BeneficiaryLanguage>>;
  let prefCourseRepo: jest.Mocked<Repository<BeneficiaryPreferredCourses>>;

  beforeEach(async () => {
    beneficiaryRepo = {
      create: jest.fn(),
      save: jest.fn(),
    } as any;

    userRepo = {
      findOne: jest.fn(),
    } as any;

    langRepo = {
      create: jest.fn(),
      save: jest.fn(),
    } as any;

    prefCourseRepo = {
      create: jest.fn(),
      save: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BeneficiaryService,
        { provide: getRepositoryToken(Beneficiary), useValue: beneficiaryRepo },
        { provide: getRepositoryToken(BeneficiaryLanguage), useValue: langRepo },
        { provide: getRepositoryToken(BeneficiaryPreferredCourses), useValue: prefCourseRepo },
        { provide: getRepositoryToken(CommunicationPreference), useValue: {} },
        { provide: getRepositoryToken(Schedule), useValue: {} },
        { provide: getRepositoryToken(AreaAdviser), useValue: {} },
        { provide: getRepositoryToken(User), useValue: userRepo },
      ],
    }).compile();

    service = module.get<BeneficiaryService>(BeneficiaryService);
  });

  it('should create a beneficiary without userId', async () => {
    const dto: any = {
      name: 'Juan',
      lastName: 'Perez',
      dni: '12345678',
      beneficiaryLanguage: [],
      beneficiaryPreferredCourses: [],
      schedule: [],
      communicationPreferences: [],
      areaAdvisers: [],
      allpaAdvisoryConsent: true,
      allpaImageConsent: true,
      ruruAdvisoryConsent: true,
    };

    beneficiaryRepo.create.mockReturnValue(dto);
    beneficiaryRepo.save.mockResolvedValue({ ...dto, id: 1 });

    const result = await service.create(dto);
    expect(result.id).toBe(1);
    expect(beneficiaryRepo.create).toHaveBeenCalledWith(expect.objectContaining({ name: 'Juan' }));
    expect(beneficiaryRepo.save).toHaveBeenCalled();
  });

  it('should throw NotFoundException if userId does not exist', async () => {
    const dto: any = {
      name: 'Ana',
      lastName: 'Gomez',
      dni: '87654321',
      userId: 999,
      beneficiaryLanguage: [],
      beneficiaryPreferredCourses: [],
      schedule: [],
      communicationPreferences: [],
      areaAdvisers: [],
      allpaAdvisoryConsent: true,
      allpaImageConsent: true,
      ruruAdvisoryConsent: true,
    };

    userRepo.findOne.mockResolvedValue(null);
    await expect(service.create(dto)).rejects.toThrow(NotFoundException);
  });

  it('should throw if language is OTHER and customLanguageName is missing', async () => {
    const dto: any = {
      name: 'Pedro',
      lastName: 'Rojas',
      dni: '11223344',
      beneficiaryLanguage: [
        { language: LANGUAGES.OTHER },
      ],
      beneficiaryPreferredCourses: [],
      schedule: [],
      communicationPreferences: [],
      areaAdvisers: [],
      allpaAdvisoryConsent: true,
      allpaImageConsent: true,
      ruruAdvisoryConsent: true,
    };

    beneficiaryRepo.create.mockReturnValue(dto);
    beneficiaryRepo.save.mockResolvedValue({ ...dto, id: 2 });

    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw if language is not OTHER but has customLanguageName', async () => {
    const dto: any = {
      name: 'Luisa',
      lastName: 'Martínez',
      dni: '55667788',
      beneficiaryLanguage: [
        { language: LANGUAGES.QUECHUA, customLanguageName: 'Lengua inventada' },
      ],
      beneficiaryPreferredCourses: [],
      schedule: [],
      communicationPreferences: [],
      areaAdvisers: [],
      allpaAdvisoryConsent: true,
      allpaImageConsent: true,
      ruruAdvisoryConsent: true,
    };

    beneficiaryRepo.create.mockReturnValue(dto);
    beneficiaryRepo.save.mockResolvedValue({ ...dto, id: 3 });

    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw if course is OTROS and customCourseName is missing', async () => {
    const dto: any = {
      name: 'Mario',
      lastName: 'Sanchez',
      dni: '99887766',
      beneficiaryLanguage: [],
      beneficiaryPreferredCourses: [
        { name: PREFERED_COURSES.OTROS },
      ],
      schedule: [],
      communicationPreferences: [],
      areaAdvisers: [],
      allpaAdvisoryConsent: true,
      allpaImageConsent: true,
      ruruAdvisoryConsent: true,
    };

    beneficiaryRepo.create.mockReturnValue(dto);
    beneficiaryRepo.save.mockResolvedValue({ ...dto, id: 4 });

    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw if course is not OTROS but customCourseName is present', async () => {
    const dto: any = {
      name: 'Laura',
      lastName: 'Nieto',
      dni: '44556677',
      beneficiaryLanguage: [],
      beneficiaryPreferredCourses: [
        { name: PREFERED_COURSES.MATEMATICA, customCourseName: 'Curso inventado' },
      ],
      schedule: [],
      communicationPreferences: [],
      areaAdvisers: [],
      allpaAdvisoryConsent: true,
      allpaImageConsent: true,
      ruruAdvisoryConsent: true,
    };

    beneficiaryRepo.create.mockReturnValue(dto);
    beneficiaryRepo.save.mockResolvedValue({ ...dto, id: 5 });

    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
  });
});
