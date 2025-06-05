import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { RegisterDto } from '../auth/dto/register.dto';
import { Rol } from './entities/rol.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
  ) {}
  async create(data: CreateUserDto): Promise<User> {
    const user = this.userRepo.create(data);
    return await this.userRepo.save(user);
  }
  async createAuth(data: RegisterDto): Promise<User> {
    const user = this.userRepo.create(data);
    const rol = await this.rolRepository.findOne({
      where: { name: data.rolName },
    });
    if (!rol) {
      throw new Error('Role not found');
    }
    user.rol = rol;
    return await this.userRepo.save(user);
  }

  async findByEmail(
    email: string,
    withRelations = false,
  ): Promise<User | undefined> {
    const user = await this.userRepo.findOne({
      where: { email },
      relations: withRelations ? ['rol'] : [],
    });
    return user ?? undefined;
  }

  async findById(id: number, withRelations = false): Promise<User | undefined> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: withRelations ? ['rol'] : [],
    });
    return user ?? undefined;
  }
}
