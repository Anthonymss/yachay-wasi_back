import { Test, TestingModule } from '@nestjs/testing';
import { VolunteerService } from '../../src/modules/volunteer/service/volunteer.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Volunteer, TYPE_VOLUNTEER } from '../../src/modules/volunteer/entities/volunteer.entity';
import { NotFoundException } from '@nestjs/common';

describe('VolunteerService', () => {
  let service: VolunteerService;
  let volunteerRepo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VolunteerService,
        {
          provide: getRepositoryToken(Volunteer),
          useValue: {
            findAndCount: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<VolunteerService>(VolunteerService);
    volunteerRepo = module.get(getRepositoryToken(Volunteer));
  });

  describe('findAll', () => {
    it('should return paginated volunteers by type', async () => {
      const mockVolunteers = [
        { id: 1, name: 'Luis', schedules: [] },
        { id: 2, name: 'María', schedules: [] },
      ];
      const total = 2;

      volunteerRepo.findAndCount.mockResolvedValue([mockVolunteers, total]);

      const result = await service.findAll(TYPE_VOLUNTEER.STAFF, 1, 10);

      expect(result).toEqual({
        data: mockVolunteers,
        total: 2,
        page: 1,
        lastPage: 1,
      });

      expect(volunteerRepo.findAndCount).toHaveBeenCalledWith({
        where: { typeVolunteer: TYPE_VOLUNTEER.STAFF },
        relations: ['schedules'],
        skip: 0,
        take: 10,
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('getProfileVolunteer', () => {
    it('should return volunteer by id', async () => {
      const mockVolunteer = { id: 1, name: 'Juan' };
      volunteerRepo.findOne.mockResolvedValue(mockVolunteer);

      const result = await service.getProfileVolunteer(1);
      expect(result).toEqual(mockVolunteer);
    });

    it('should throw if volunteer not found', async () => {
      volunteerRepo.findOne.mockResolvedValue(null);
      await expect(service.getProfileVolunteer(999)).rejects.toThrow(NotFoundException);
    });
  });
});
