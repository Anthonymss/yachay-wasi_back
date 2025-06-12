import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Rol } from 'src/modules/user/entities/rol.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminSeeder {
  private readonly log = new Logger('AdminSeeder');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
  ) {}

  async seed() {
    const adminEmail = 'admin@yachaywasi.com';
    const existingAdmin = await this.userRepository.findOne({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      this.log.log('El usuario administrador ya existe');
      return;
    }

    const adminRole = await this.rolRepository.findOne({
      where: { name: 'Admin' },
    });

    if (!adminRole) {
      this.log.error('El rol de administrador no existe');
      return;
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const adminUser = this.userRepository.create({
      name: 'Admin',
      lastName: 'YachayWasi',
      phoneNumber: '999999999',
      email: adminEmail,
      password: hashedPassword,
      rol: adminRole,
    });

    await this.userRepository.save(adminUser);
    this.log.log('Usuario administrador creado exitosamente');
  }
} 