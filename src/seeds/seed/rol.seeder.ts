import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from 'src/modules/user/entities/rol.entity';

@Injectable()
export class RolSeeder {
  private readonly log = new Logger('Seeder');

  constructor(
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
  ) {}

  async seed() {
    const roles = [
      { name: 'Admin', description: '1' },
      { name: 'Lideres', description: '2' }, //adviser
      { name: 'Coordinadores', description: '3' },
      { name: 'Areas_STAFF', description: '4' },
    ];

    for (const role of roles) {
      const existingRole = await this.rolRepository.findOne({
        where: { name: role.name },
      });

      if (!existingRole) {
        await this.rolRepository.save(role);
        this.log.log(`Rol "${role.name}" creado`);
      } else {
        this.log.log(`Rol "${role.name}" ya existe`);
      }
    }
  }
}
