import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { StatusVolunteer, TYPE_VOLUNTEER, Volunteer } from '../volunteer/entities/volunteer.entity';
import { SubArea } from '../area/entities/area-volunteer/sub-area.entity';
import { Beneficiary } from '../beneficiary/entities/beneficiary.entity';
import { StatisticsDto } from './statistics.dto';
import { Donation } from '../donation/entities/donation.entity';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Volunteer)
    private readonly volunteerRepository: Repository<Volunteer>,
    @InjectRepository(SubArea)
    private readonly subAreaRepository: Repository<SubArea>,
    @InjectRepository(Beneficiary)
    private readonly beneficiaryRepository: Repository<Beneficiary>,
    @InjectRepository(Donation)
    private readonly donationRepository: Repository<Donation>,
  ) {}

  async getStatistics(): Promise<StatisticsDto> {
    const allVolunteers = await this.volunteerRepository.find();
    const beneficiaries = await this.beneficiaryRepository.find();

    const approvedVolunteers = allVolunteers.filter(
      v => v.statusVolunteer === StatusVolunteer.APPROVED,
    );
    const rejectedVolunteers = allVolunteers.filter(
      v => v.statusVolunteer === StatusVolunteer.REJECTED,
    );

    const adviserVolunteers = allVolunteers.filter(
      v => v.typeVolunteer === TYPE_VOLUNTEER.ADVISER,
    );
    const staffVolunteers = allVolunteers.filter(
      v => v.typeVolunteer === TYPE_VOLUNTEER.STAFF,
    );

    const adviserApprovedVolunteers = adviserVolunteers.filter(
      v => v.statusVolunteer === StatusVolunteer.APPROVED,
    );
    const staffApprovedVolunteers = staffVolunteers.filter(
      v => v.statusVolunteer === StatusVolunteer.APPROVED,
    );

    const adviserRejectedVolunteers = adviserVolunteers.filter(
      v => v.statusVolunteer === StatusVolunteer.REJECTED,
    );
    const staffRejectedVolunteers = staffVolunteers.filter(
      v => v.statusVolunteer === StatusVolunteer.REJECTED,
    );

    const adviserPendingVolunteers = adviserVolunteers.filter(
      v => v.statusVolunteer !== StatusVolunteer.APPROVED &&
           v.statusVolunteer !== StatusVolunteer.REJECTED,
    );
    const staffPendingVolunteers = staffVolunteers.filter(
      v => v.statusVolunteer !== StatusVolunteer.APPROVED &&
           v.statusVolunteer !== StatusVolunteer.REJECTED,
    );

    const volunteersByArea = Object.values(
      approvedVolunteers.reduce((acc, { idPostulationArea }) => {
        acc[idPostulationArea] ??= { areaId: idPostulationArea, count: 0 };
        acc[idPostulationArea].count++;
        return acc;
      }, {} as Record<number, { areaId: number; count: number }>),
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
      }, {} as Record<string, { university: string; count: number }>),
    );

    const donations = await this.donationRepository.find();
    const totalDonations = donations.reduce((acc, donation) => acc + donation.amount, 0);

    return {
      totalVolunteers: allVolunteers.length,
      totalVolunteersApproved: approvedVolunteers.length,
      totalVolunteersRejected: rejectedVolunteers.length,
      totalVolunteersPending:
        allVolunteers.length - approvedVolunteers.length - rejectedVolunteers.length,

      totalVolunteersAdviserApproved: adviserApprovedVolunteers.length,
      totalVolunteersAdviserRejected: adviserRejectedVolunteers.length,
      totalVolunteersAdviserPending: adviserPendingVolunteers.length,

      totalVolunteersStaffApproved: staffApprovedVolunteers.length,
      totalVolunteersStaffRejected: staffRejectedVolunteers.length,
      totalVolunteersStaffPending: staffPendingVolunteers.length,

      volunteersByArea: volunteersByAreaWithNames,
      volunteersByUniversity,
      totalDonations,
      totalBeneficiaries: beneficiaries.length,
    };
  }
}
