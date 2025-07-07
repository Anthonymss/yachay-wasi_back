export class StatisticsDto {
  totalVolunteers: number;
  totalVolunteersAdviser: number;
  totalVolunteersStaff: number;
  totalVolunteersApproved: number;
  totalVolunteersRejected: number;
  totalVolunteersPending: number;
  volunteersByArea: { areaId: number; areaName: string; count: number }[];
  volunteersByUniversity: { university: string; count: number }[];
  totalDonations: number;
  totalBeneficiaries: number;
}
