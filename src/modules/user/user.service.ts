import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { RegisterDto } from '../auth/dto/register.dto';
import { Rol } from './entities/rol.entity';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { MailService } from 'src/shared/mail/mail.service';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileDto } from './dto/profile.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
    private readonly mailService: MailService,
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

  //new

  // resetPassword(resetPasswordDto: ResetPasswordDto) {
  //   throw new Error('Method not implemented.');
  //}
  async resetPassword(token: string, newPassword: string) {
    try {
      const payload = jwt.verify(token, process.env.JWT_RESET_SECRET || '') as {
        email: string;
      };
      const user = await this.userRepo.findOne({
        where: { email: payload.email },
      });

      if (!user) throw new NotFoundException('Usuario no encontrado');

      user.password = await bcrypt.hash(newPassword, 10);
      await this.userRepo.save(user);

      return { message: 'Contraseña actualizada correctamente' };
    } catch (error) {
      throw new BadRequestException('Token inválido o expirado');
    }
  }

  async sendResetPasswordEmail(body: { email: string }) {
    const { email } = body;
    const user = await this.userRepo.findOne({ where: { email } });
    console.log(user);

    if (!user) throw new NotFoundException('Correo no registrado');

    const token = jwt.sign(
      { email: user.email },
      process.env.JWT_RESET_SECRET || '',
      {
        expiresIn: '15m',
      },
    );

    const resetUrl = `${process.env.INTRANET_URL}/reset-password?token=${token}`;

    await this.mailService.sendTemplate(
      user.email,
      'reset-password',
      { subject: 'Restablece tu contraseña' },
      { name: user.name, resetUrl },
    );

    return { message: 'Correo de recuperación enviado' };
  }

  //profile
  async getProfile(userId: number): Promise<ProfileDto> {
    if (!userId)
      throw new NotFoundException('No se paso el parametro id del token');
    const user = await this.userRepo.findOne({
      where: { id: Number(userId) },
      relations: ['rol'],
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return {
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.rol?.name,
      createdAt: user.createdAt,
    };
  }

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto) {
    const user = await this.userRepo.findOne({ where: { id: Number(userId) } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    if (updateProfileDto.name) user.name = updateProfileDto.name;
    if (updateProfileDto.email) user.email = updateProfileDto.email;
    if (updateProfileDto.phoneNumber)
      user.phoneNumber = updateProfileDto.phoneNumber;

    return this.userRepo.save(user);
  }
}
