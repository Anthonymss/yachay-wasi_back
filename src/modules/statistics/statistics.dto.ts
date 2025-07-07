export class StatisticsDto {
  totalVolunteers: number;
  totalVolunteersPending: number;
  totalVolunteersRejected: number;
  totalVolunteersApproved: number;

  totalVolunteersAdviserApproved: number;
  totalVolunteersAdviserRejected: number;
  totalVolunteersAdviserPending: number;
  
  totalVolunteersStaffApproved: number;
  totalVolunteersStaffRejected: number;
  totalVolunteersStaffPending: number;

  volunteersByArea: { areaId: number; areaName: string; count: number }[];
  volunteersByUniversity: { university: string; count: number }[];
  totalDonations: number;
  totalBeneficiaries: number;
}
