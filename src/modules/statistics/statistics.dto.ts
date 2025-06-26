export class StatisticsDto {
    totalVolunteers: number;
    volunteersByArea: { area: string; count: number }[];
    volunteersByUniversity: { university: string; count: number }[];
    totalDonations: number;
    totalBeneficiaries: number;
}    
