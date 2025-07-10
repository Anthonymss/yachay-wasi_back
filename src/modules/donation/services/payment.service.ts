import { Injectable, BadRequestException } from '@nestjs/common';
import { PaypalStrategy } from '../strategies/paypal.strategy';
import {
  PaymentStrategy,
  CreatePaymentDto,
  PaymentResponseDto,
  PaymentVerificationResult,
  PaymentMethod,
} from '../interfaces/payment.strategy';

@Injectable()
export class PaymentService {
  constructor(private paypal: PaypalStrategy) {}

  private resolve(strategy: PaymentMethod): PaymentStrategy {
    switch (strategy) {
      case PaymentMethod.PAYPAL:
        return this.paypal;
      default:
        throw new BadRequestException('Método de pago no soportado');
    }
  }

  createPayment(
    method: PaymentMethod,
    dto: CreatePaymentDto,
  ): Promise<PaymentResponseDto> {
    return this.resolve(method).createPayment(dto);
  }

  capturePayment(method: PaymentMethod, orderId: string): Promise<PaymentVerificationResult> {
    return this.resolve(method).capturePayment(orderId);
  }
}