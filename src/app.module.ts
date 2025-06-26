import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { databaseConfig } from './database/database.config';
import { CloudinaryModule } from './shared/cloudinary/cloudinary.module';
import { VolunteerModule } from './modules/volunteer/volunteer.module';
import { BeneficiaryModule } from './modules/beneficiary/beneficiary.module';
import { AreaModule } from './modules/area/area.module';
import { DonationModule } from './modules/donation/donation.module';
import { StatisticsModule } from './modules/statistics/statistics.module';
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
    BeneficiaryModule,
    AreaModule,
    DonationModule,
    StatisticsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
