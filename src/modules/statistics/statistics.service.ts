import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { StatusVolunteer, TYPE_VOLUNTEER, Volunteer } from '../volunteer/entities/volunteer.entity';
import { SubArea } from '../area/entities/area-volunteer/sub-area.entity';
import { Beneficiary } from '../beneficiary/entities/beneficiary.entity';
import { StatisticsDto } from './statistics.dto';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Volunteer)
    private readonly volunteerRepository: Repository<Volunteer>,
    @InjectRepository(SubArea)
    private readonly subAreaRepository: Repository<SubArea>,
    @InjectRepository(Beneficiary)
    private readonly beneficiaryRepository: Repository<Beneficiary>,
  ) {}

  async getStatistics(): Promise<StatisticsDto> {
    const allVolunteers = await this.volunteerRepository.find();
    const beneficiaries = await this.beneficiaryRepository.find();

    const approvedVolunteers = allVolunteers.filter(v => v.statusVolunteer === StatusVolunteer.APPROVED);
    const rejectedVolunteers = allVolunteers.filter(v => v.statusVolunteer === StatusVolunteer.REJECTED);
    const adviserVolunteers = approvedVolunteers.filter(v => v.typeVolunteer === TYPE_VOLUNTEER.ADVISER);
    const staffVolunteers = approvedVolunteers.filter(v => v.typeVolunteer === TYPE_VOLUNTEER.STAFF);

    const volunteersByArea = Object.values(
      approvedVolunteers.reduce((acc, { idPostulationArea }) => {
        acc[idPostulationArea] ??= { areaId: idPostulationArea, count: 0 };
        acc[idPostulationArea].count++;
        return acc;
      }, {} as Record<number, { areaId: number; count: number }>)
    );

    const subAreas = await this.subAreaRepository.findBy({
      id: In(volunteersByArea.map(g => g.areaId)),
    });

    const subAreaMap = new Map(subAreas.map(sa => [sa.id, sa.name]));
    const volunteersByAreaWithNames = volunteersByArea.map(({ areaId, count }) => ({
      areaId,
      areaName: subAreaMap.get(areaId) || `Área ${areaId}`,
      count,
    }));

    const volunteersByUniversity = Object.values(
      approvedVolunteers.reduce((acc, { programsUniversity }) => {
        if (!programsUniversity) return acc;
        acc[programsUniversity] ??= { university: programsUniversity, count: 0 };
        acc[programsUniversity].count++;
        return acc;
      }, {} as Record<string, { university: string; count: number }>)
    );

    return {
      totalVolunteers: allVolunteers.length,
      totalVolunteersApproved: approvedVolunteers.length,
      totalVolunteersRejected: rejectedVolunteers.length,
      totalVolunteersAdviser: adviserVolunteers.length,
      totalVolunteersStaff: staffVolunteers.length,
      totalVolunteersPending: allVolunteers.length - approvedVolunteers.length - rejectedVolunteers.length,
      volunteersByArea: volunteersByAreaWithNames,
      volunteersByUniversity,
      totalDonations: 10, 
      totalBeneficiaries: beneficiaries.length,
    };
  }
}
