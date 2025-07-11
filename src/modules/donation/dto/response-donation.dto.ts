import { PaymentMethod } from '../interfaces/payment.strategy';

export class CreateDonationDto {
  name?: string;
  email?: string;
  amount: number;
  currency: string;
  donationType: string;
  message?: string;
  is_anonymous: boolean;
  paymentMethod: PaymentMethod;
  return_url: string;
  cancel_url: string;
}