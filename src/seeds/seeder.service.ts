import { Injectable } from '@nestjs/common';
import { RolSeeder } from './seed/rol.seeder';
import { AreaSeeder } from './seed/area.seeder';
import { AdminSeeder } from './seed/admin.seeder';

@Injectable()
export class SeederService {
  constructor(
    private readonly rolSeeder: RolSeeder,
    private readonly areaSeeder: AreaSeeder,
    private readonly adminSeeder: AdminSeeder,
  ) {}
  async seed() {
    await this.rolSeeder.seed();
    await this.areaSeeder.seed();
    await this.adminSeeder.seed();
    // aqui se agregaran mas llamadas a otros seeders
  }
}
