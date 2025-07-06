import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { databaseConfig } from './database/database.config';
import { VolunteerModule } from './modules/volunteer/volunteer.module';
import { BeneficiaryModule } from './modules/beneficiary/beneficiary.module';
import { AreaModule } from './modules/area/area.module';
import { DonationModule } from './modules/donation/donation.module';
import { StatisticsModule } from './modules/statistics/statistics.module';
import { MailModule } from './shared/mail/mail.module';
import { S3Module } from './shared/s3/s3.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(databaseConfig),
    AuthModule,
    UserModule,
    VolunteerModule,
    BeneficiaryModule,
    AreaModule,
    DonationModule,
    StatisticsModule,
    MailModule,
    S3Module,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
