import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { databaseConfig } from './database/database.config';
import { CloudinaryModule } from './shared/cloudinary/cloudinary.module';
import { VolunteerModule } from './modules/volunteer/volunteer.module';
import { AreaStaffModule } from './modules/area-staff/area-staff.module';
import { BeneficiaryModule } from './modules/beneficiary/beneficiary.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(databaseConfig),
    AuthModule,
    UserModule,
    CloudinaryModule,
    VolunteerModule,
    AreaStaffModule,
    BeneficiaryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
