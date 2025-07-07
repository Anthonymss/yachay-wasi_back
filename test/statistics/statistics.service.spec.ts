import { Test, TestingModule } from '@nestjs/testing';
import { StatisticsService } from 'src/modules/statistics/statistics.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Volunteer, StatusVolunteer, TYPE_VOLUNTEER, ProgramsUniversity } from 'src/modules/volunteer/entities/volunteer.entity';
import { SubArea } from 'src/modules/area/entities/area-volunteer/sub-area.entity';
import { Beneficiary } from 'src/modules/beneficiary/entities/beneficiary.entity';
import { Repository } from 'typeorm';

describe('StatisticsService (simplified)', () => {
  let service: StatisticsService;
  let volunteerRepo: jest.Mocked<Repository<Volunteer>>;
  let subAreaRepo: jest.Mocked<Repository<SubArea>>;
  let beneficiaryRepo: jest.Mocked<Repository<Beneficiary>>;

  beforeEach(async () => {
    volunteerRepo = { find: jest.fn() } as any;
    subAreaRepo = { findBy: jest.fn() } as any;
    beneficiaryRepo = { find: jest.fn() } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatisticsService,
        { provide: getRepositoryToken(Volunteer), useValue: volunteerRepo },
        { provide: getRepositoryToken(SubArea), useValue: subAreaRepo },
        { provide: getRepositoryToken(Beneficiary), useValue: beneficiaryRepo },
      ],
    }).compile();

    service = module.get<StatisticsService>(StatisticsService);
  });

  it('should compute basic stats correctly', async () => {
    const volunteers: Partial<Volunteer>[] = [
        {
          id: 1,
          statusVolunteer: StatusVolunteer.APPROVED,
          typeVolunteer: TYPE_VOLUNTEER.ADVISER,
          idPostulationArea: 1,
          programsUniversity: ProgramsUniversity.UCV,
        },
        {
          id: 2,
          statusVolunteer: StatusVolunteer.APPROVED,
          typeVolunteer: TYPE_VOLUNTEER.STAFF,
          idPostulationArea: 2,
          programsUniversity: ProgramsUniversity.UCV,
        },
        {
          id: 3,
          statusVolunteer: StatusVolunteer.REJECTED,
          typeVolunteer: TYPE_VOLUNTEER.ADVISER,
          idPostulationArea: 1,
          programsUniversity: ProgramsUniversity.UCV,
        },
      ];
      
    const subAreas: Partial<SubArea>[] = [
      { id: 1, name: 'Área 1' },
      { id: 2, name: 'Área 2' },
    ];

    const beneficiaries: Partial<Beneficiary>[] = [
      { id: 1 },
      { id: 2 },
    ];

    volunteerRepo.find.mockResolvedValue(volunteers as Volunteer[]);
    subAreaRepo.findBy.mockResolvedValue(subAreas as SubArea[]);
    beneficiaryRepo.find.mockResolvedValue(beneficiaries as Beneficiary[]);

    const stats = await service.getStatistics();

    expect(stats.totalVolunteers).toBe(3);
    expect(stats.totalVolunteersApproved).toBe(2);
    expect(stats.totalVolunteersRejected).toBe(1);
    expect(stats.totalVolunteersAdviser).toBe(1);
    expect(stats.totalVolunteersStaff).toBe(1);
    expect(stats.totalVolunteersPending).toBe(0);
    expect(stats.totalBeneficiaries).toBe(2);
    expect(stats.totalDonations).toBe(10);

    expect(stats.volunteersByArea).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ areaId: 1, areaName: 'Área 1', count: 1 }),
        expect.objectContaining({ areaId: 2, areaName: 'Área 2', count: 1 }),
      ])
    );

    expect(stats.volunteersByUniversity).toEqual(
      expect.arrayContaining([
        { university: 'UCV', count: 2 },
      ])
    );
  });
});
