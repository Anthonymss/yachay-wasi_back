import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Donation } from '../entities/donation.entity';
import { PaymentService } from '../services/payment.service';
import { MailService } from '../../../shared/mail/mail.service';
import { CreateDonationDto } from '../dto/create-donation.dto';
import { PaymentMethod, DonationStatus } from '../interfaces/payment.strategy';

@Injectable()
export class DonationService {
  constructor(
    @InjectRepository(Donation)
    private readonly repo: Repository<Donation>,
    private readonly payments: PaymentService,
    private readonly mailService: MailService,
    private readonly config: ConfigService,
  ) {}

  async create(dto: CreateDonationDto) {
    const payment = await this.payments.createPayment(dto.paymentMethod, {
      amount: dto.amount.toString(),
      currency: dto.currency,
      description: dto.message,
    });

    const record = this.repo.create({
      ...dto,
      status: DonationStatus.PENDING,
      orderId: payment.orderId,
    });

    await this.repo.save(record);

    return { redirectUrl: payment.redirectUrl };
  }

  async capture(orderId: string, method: PaymentMethod) {
    const existing = await this.repo.findOne({ where: { orderId } });

    if (!existing) {
      throw new Error('No se encontró una donación para este token de orden.');
    }

    if (existing.status === DonationStatus.COMPLETED) {
      return {
        message: 'Esta orden ya fue capturada.',
        donation: existing,
      };
    }

    try {
      const result = await this.payments.capturePayment(method, orderId);

      const updated = await this.repo.save({
        ...existing,
        status: result.status,
        orderId,
      });

      if (result.status === DonationStatus.COMPLETED) {
        await this.mailService.sendTemplate(
          updated.email,
          'donation-success',
          { subject: 'Gracias por tu donación a Yachay Wasi' },
          {
            nombre: updated.name,
            cantidad: updated.amount,
            moneda: updated.currency,
            orderId: updated.orderId,
            metodoPago: method,
            mensaje: updated.message,
          }
        );
      }

      return updated;
    } catch (error) {
      if (
        error.statusCode === 422 &&
        error.name === 'UNPROCESSABLE_ENTITY'
      ) {
        const completed = await this.repo.save({
          ...existing,
          status: DonationStatus.COMPLETED,
        });

        return {
          message: 'Esta orden ya fue capturada previamente.',
          donation: completed,
        };
      }

      throw error;
    }
  }

  async validateDonation(id: number) {
    const donation = await this.repo.findOne({ where: { id } });

    if (!donation) {
      return { message: 'No se encontró esta donación.' };
    }

    switch (donation.status) {
      case DonationStatus.COMPLETED:
        return { message: 'Ya se capturó esta orden.', donation };
      case DonationStatus.FAILED:
        return { message: 'La orden falló.', donation };
      case DonationStatus.CANCELLED:
        return { message: 'La orden fue cancelada.', donation };
      case DonationStatus.PENDING:
        return { message: 'La orden está pendiente.', donation };
      default:
        return { message: 'Estado desconocido.', donation };
    }
  }
}
