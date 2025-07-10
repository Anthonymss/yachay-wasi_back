import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Donation } from '../entities/donation.entity';
import { PaymentService } from '../services/payment.service';
import { CreateDonationDto } from '../dto/create-donation.dto';
import { PaymentMethod, DonationStatus } from '../interfaces/payment.strategy';

@Injectable()
export class DonationService {
  constructor(
    @InjectRepository(Donation)
    private readonly repo: Repository<Donation>,
    private readonly payments: PaymentService,
    private readonly config: ConfigService,
  ) {}

  async create(dto: CreateDonationDto) {
    const payment = await this.payments.createPayment(
      dto.paymentMethod,
      {
        amount: dto.amount.toString(),
        currency: dto.currency,
        description: dto.message,
      },
    );

    const record = this.repo.create({
      ...dto,
      status: DonationStatus.PENDING,
      paypalOrderId: payment.orderId,
    });
    await this.repo.save(record);

    return { redirectUrl: payment.redirectUrl };
  }

  async capture(orderId: string, method: PaymentMethod) {
    const existing = await this.repo.findOne({ where: { paypalOrderId: orderId } });
    if (!existing) {
      throw new Error('Donation not found for this order');
    }
    
    try {
      const result = await this.payments.capturePayment(method, orderId);
      
      const donation = await this.repo.save({
        ...existing,
        status: result.status,
        paypalOrderId: orderId,
      });
      
      return donation;
    } catch (error) {
      if (error.statusCode === 422 && error.name === 'UNPROCESSABLE_ENTITY') {
        return { 
          message: 'Order already captured', 
          donation: { 
            ...existing,
            status: DonationStatus.COMPLETED,
            receiptUrl: existing.receiptUrl || null
          }
        };
      }
      throw error;
    }
  }
  async validateDonation(id: number) {
    const donation = await this.repo.findOne({ where: { id } });
    if (donation?.status === DonationStatus.COMPLETED) {
      return { message: 'Ya se capturó esta orden.', donation };
    }
    if (donation?.status === DonationStatus.FAILED) {
      return { message: 'La orden falló.', donation };
    }
    if (donation?.status === DonationStatus.CANCELLED) {
      return { message: 'La orden fue cancelada.', donation };
    }
    if (donation?.status === DonationStatus.PENDING) {
      return { message: 'La orden está pendiente.', donation };
    }
    return donation;
  }
  
}