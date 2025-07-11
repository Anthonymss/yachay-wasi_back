export enum PaymentMethod {
  PAYPAL = 'paypal',
  STRIPE = 'stripe',
  BIZUM = 'bizum',
  BANK_TRANSFER = 'bank_transfer',
}

export enum DonationStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export interface CreatePaymentDto {
  amount: string;
  currency: string;
  description?: string;
  payer_email?: string;
  payer_name?: string;
}

export interface PaymentResponseDto {
  orderId: string;
  links: Array<{ href: string; rel: string; method: string }>;
  redirectUrl: string;
}

export interface PaymentVerificationResult {
  success: boolean;
  receiptUrl: string;
  status: DonationStatus;
}

export interface PaymentStrategy {
  createPayment(data: CreatePaymentDto): Promise<PaymentResponseDto>;
  capturePayment(orderId: string): Promise<PaymentVerificationResult>;
}