import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as paypal from '@paypal/checkout-server-sdk';
import {
  PaymentStrategy,
  CreatePaymentDto,
  PaymentResponseDto,
  PaymentVerificationResult,
  DonationStatus,
} from '../interfaces/payment.strategy';

@Injectable()
export class PaypalStrategy implements PaymentStrategy {
  private client: paypal.core.PayPalHttpClient;

  constructor(private config: ConfigService) {
    const env =
      this.config.get<string>('PAYPAL_ENV') === 'live'
        ? new paypal.core.LiveEnvironment(
            this.config.get('PAYPAL_CLIENT_ID'),
            this.config.get('PAYPAL_CLIENT_SECRET'),
          )
        : new paypal.core.SandboxEnvironment(
            this.config.get('PAYPAL_CLIENT_ID'),
            this.config.get('PAYPAL_CLIENT_SECRET'),
          );
    this.client = new paypal.core.PayPalHttpClient(env);
  }

  async createPayment(data: CreatePaymentDto): Promise<PaymentResponseDto> {
    const req = new paypal.orders.OrdersCreateRequest();
    req.prefer('return=representation');
  
    const landingUrl = this.config.get<string>('LANDING_URL');
  
    req.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: data.currency,
          value: data.amount,
        },
        description: data.description,
      }],
      application_context: {
        return_url: `${landingUrl}/success`,
        cancel_url: `${landingUrl}/cancel`,
      },
    });
  
    const res = await this.client.execute(req);
    const result = res.result;
    const redirectUrl = result.links.find((l) => l.rel === 'approve')?.href;
  
    return {
      orderId: result.id,
      links: result.links,
      redirectUrl,
    };
  }
  

  async capturePayment(orderId: string): Promise<PaymentVerificationResult> {
    try {
      const req = new paypal.orders.OrdersCaptureRequest(orderId);
      req.requestBody({});
      const res = await this.client.execute(req);
      const cap = res.result?.purchase_units?.[0]?.payments?.captures?.[0];
  
      if (!cap) throw new Error('No se pudo obtener la captura de la orden');

  
      return {
        success: cap.status === 'COMPLETED',
        receiptUrl: `https://www.paypal.com/receipt/${cap.id}`,
        status: cap.status.toLowerCase() as DonationStatus,
      };
    } catch (error: any) {
      const bodyText = error._originalError?.text || '';
      if (
        error.statusCode === 422 &&
        bodyText.includes('ORDER_ALREADY_CAPTURED')
      ) {
        const orderReq = new paypal.orders.OrdersGetRequest(orderId);
        const orderRes = await this.client.execute(orderReq);
        const cap = orderRes.result?.purchase_units?.[0]?.payments?.captures?.[0];
  
        if (!cap) throw new Error('La orden ya fue capturada pero no se pudo obtener información de la captura');
  
        return {
          success: cap.status === 'COMPLETED',
          receiptUrl: `https://www.paypal.com/receipt/${cap.id}`,
          status: cap.status.toLowerCase() as DonationStatus,
        };
      }
      throw BadRequestException;
    }
  }
}