import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Rol } from './entities/rol.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { MailModule } from 'src/shared/mail/mail.module';
@Module({
  imports: [TypeOrmModule.forFeature([User, Rol, RefreshToken]), MailModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
