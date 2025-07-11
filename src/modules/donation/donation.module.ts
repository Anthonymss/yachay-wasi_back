import { Module } from '@nestjs/common';
import { DonationService } from './services/donation.service';
import { DonationController } from './controller/donation.controller';
import { PaymentService } from './services/payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Donation } from './entities/donation.entity';
import { MailModule } from  'src/shared/mail/mail.module';
import { PaypalStrategy } from './strategies/paypal.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([Donation]), MailModule],
  controllers: [DonationController],
  providers: [DonationService, PaymentService, PaypalStrategy],
})
export class DonationModule {}
