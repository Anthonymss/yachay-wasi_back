import { Injectable } from '@nestjs/common';
import { RolSeeder } from './seed/rol.seeder';
import { AreaSeeder } from './seed/area.seeder';
@Injectable()
export class SeederService {
  constructor(
    private readonly rolSeeder: RolSeeder,
    private readonly areaSeeder: AreaSeeder,
  ) {}
  async seed() {
    await this.rolSeeder.seed();
    await this.areaSeeder.seed();
    // aqui se agregaran mas llamadas a otros seeders
  }
}
