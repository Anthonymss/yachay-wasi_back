import { Test, TestingModule } from '@nestjs/testing';
import { StatisticsService } from 'src/modules/statistics/statistics.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Volunteer, StatusVolunteer, TYPE_VOLUNTEER, ProgramsUniversity } from 'src/modules/volunteer/entities/volunteer.entity';
import { SubArea } from 'src/modules/area/entities/area-volunteer/sub-area.entity';
import { Beneficiary } from 'src/modules/beneficiary/entities/beneficiary.entity';
import { Repository } from 'typeorm';

describe('StatisticsService (updated)', () => {
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

  it('should compute new statistics structure correctly', async () => {
    const volunteers: Partial<Volunteer>[] = [
      {
        id: 1,
        statusVolunteer: StatusVolunteer.APPROVED,
        typeVolunteer: TYPE_VOLUNTEER.ADVISER,
        idPostulationArea: 1,
        programsUniversity: ProgramsUniversity.UTP,
      },
      {
        id: 2,
        statusVolunteer: StatusVolunteer.REJECTED,
        typeVolunteer: TYPE_VOLUNTEER.ADVISER,
        idPostulationArea: 1,
        programsUniversity: ProgramsUniversity.UTP,
      },
      {
        id: 3,
        statusVolunteer: StatusVolunteer.APPROVED,
        typeVolunteer: TYPE_VOLUNTEER.STAFF,
        idPostulationArea: 2,
        programsUniversity: ProgramsUniversity.UTP,
      },
      {
        id: 4,
        statusVolunteer: StatusVolunteer.PENDING,
        typeVolunteer: TYPE_VOLUNTEER.STAFF,
        idPostulationArea: 2,
        programsUniversity: ProgramsUniversity.UTP,
      },
    ];

    const subAreas: Partial<SubArea>[] = [
      { id: 1, name: 'Área 1' },
      { id: 2, name: 'Área 2' },
    ];

    const beneficiaries: Partial<Beneficiary>[] = [
      { id: 1 },
      { id: 2 },
      { id: 3 },
    ];

    volunteerRepo.find.mockResolvedValue(volunteers as Volunteer[]);
    subAreaRepo.findBy.mockResolvedValue(subAreas as SubArea[]);
    beneficiaryRepo.find.mockResolvedValue(beneficiaries as Beneficiary[]);

    const stats = await service.getStatistics();

    expect(stats.totalVolunteers).toBe(4);
    expect(stats.totalVolunteersApproved).toBe(2);
    expect(stats.totalVolunteersRejected).toBe(1);
    expect(stats.totalVolunteersPending).toBe(1);

    expect(stats.totalVolunteersAdviserApproved).toBe(1);
    expect(stats.totalVolunteersAdviserRejected).toBe(1);
    expect(stats.totalVolunteersAdviserPending).toBe(0);

    expect(stats.totalVolunteersStaffApproved).toBe(1);
    expect(stats.totalVolunteersStaffRejected).toBe(0);
    expect(stats.totalVolunteersStaffPending).toBe(1);

    expect(stats.totalBeneficiaries).toBe(3);
    expect(stats.totalDonations).toBe(10);

    expect(stats.volunteersByArea).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ areaId: 1, areaName: 'Área 1', count: 1 }),
        expect.objectContaining({ areaId: 2, areaName: 'Área 2', count: 1 }),
      ])
    );

    expect(stats.volunteersByUniversity).toEqual(
      expect.arrayContaining([
        { university: ProgramsUniversity.UTP, count: 2 },
      ])
    );
  });
});
