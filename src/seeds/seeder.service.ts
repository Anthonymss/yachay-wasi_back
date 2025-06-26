import { Injectable } from '@nestjs/common';
import { RolSeeder } from './seed/rol.seeder';
import { AreaSeeder } from './seed/area.seeder';
import { AdminSeeder } from './seed/admin.seeder';
import { VolunteerSeeder } from './seed/volunteer.seeder';

@Injectable()
export class SeederService {
  constructor(
    private readonly rolSeeder: RolSeeder,
    private readonly areaSeeder: AreaSeeder,
    private readonly adminSeeder: AdminSeeder,
    private readonly volunteerSeeder: VolunteerSeeder,
  ) {}
  async seed() {
    // aqui se agregaran mas llamadas a otros seeders
    await this.rolSeeder.seed();
    await this.areaSeeder.seed();
    await this.adminSeeder.seed();

    await this.volunteerSeeder.seedDynamic(5, 5);
  }
}
