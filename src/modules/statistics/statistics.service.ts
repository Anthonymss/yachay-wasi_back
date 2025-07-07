import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Volunteer } from '../volunteer/entities/volunteer.entity';
import { AreaStaff } from '../area/entities/area-volunteer/area-staff.entity';
import { AreaAdviser } from '../area/entities/area-beneficiary/area-adviser.entity';
import { StatisticsDto } from './statistics.dto';
import { SubAreas } from '../area/entities/area-volunteer/sub-area.entity';
@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Volunteer)
    private readonly volunteerRepository: Repository<Volunteer>,
    @InjectRepository(SubAreas)
    private readonly subAreaRepository: Repository<SubAreas>,

    @InjectRepository(AreaAdviser)
    private readonly areaAdviserRepository: Repository<AreaAdviser>,
  ) {}
  async getStatistics(): Promise<StatisticsDto> {
    /*
        const listVolunteers = await this.volunteerRepository.find();
        const listVolunteersActive = listVolunteers.map((volunteer) => {
            if(volunteer.isVoluntary){
                return volunteer;
            }
        });
        const totalVolunteersActive = listVolunteersActive.length;
        console.log(totalVolunteersActive);

        const volunteersByArea=listVolunteersActive.map((volunteer) => {


        });
        console.log(volunteersByArea);
        
        const volunteersByArea2 = await this.volunteerRepository.createQueryBuilder('volunteer')
            .select('volunteer.areaStaff', 'areaStaff')
            .addSelect('COUNT(volunteer.id)', 'count')
            .groupBy('volunteer.areaStaff')
            .getRawMany();

        const volunteersByUniversity = await this.volunteerRepository.createQueryBuilder('volunteer')
            .select('volunteer.university', 'university')
            .addSelect('COUNT(volunteer.id)', 'count')
            .groupBy('volunteer.university')
            .getRawMany();
*/
    const statistics: StatisticsDto = {
      totalVolunteers: 100,
      volunteersByArea: [
        { area: 'Area 1', count: 100 },
        { area: 'Area 2', count: 100 },
        { area: 'Area 3', count: 100 },
      ],
      volunteersByUniversity: [
        { university: 'Universidad 1', count: 100 },
        { university: 'Universidad 2', count: 100 },
        { university: 'Universidad 3', count: 100 },
      ],
      totalDonations: 10,
      totalBeneficiaries: 100,
    };

    return statistics;
  }
}
