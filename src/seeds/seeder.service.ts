import { Injectable } from '@nestjs/common';
import { RolSeeder } from './seed/rol.seeder';
import { AreaSeeder } from './seed/area.seeder';
import { AdminSeeder } from './seed/admin.seeder';
import { VolunteerSeeder } from './seed/volunteer.seeder';
import { ComunicationPreferenceSeeder } from './seed/comunication-preference.seeder';
import { BeneficiarySeeder } from './seed/beneficiary.seeder';

@Injectable()
export class SeederService {
  constructor(
    private readonly rolSeeder: RolSeeder,
    private readonly areaSeeder: AreaSeeder,
    private readonly adminSeeder: AdminSeeder,
    private readonly volunteerSeeder: VolunteerSeeder,
    private readonly comunicationPreferenceSeeder: ComunicationPreferenceSeeder,
    private readonly beneficiarySeeder: BeneficiarySeeder,
  ) {}
  async seed() {
    // aqui se agregaran mas llamadas a otros seeders
    await this.rolSeeder.seed();
    await this.areaSeeder.seed();
    await this.adminSeeder.seed();

    await this.volunteerSeeder.seedDynamic(0, 0);
    await this.comunicationPreferenceSeeder.seed();
    await this.beneficiarySeeder.seedDynamic(1);
  }
}
