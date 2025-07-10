import { Controller, Post, Body, Get, Query, Param } from '@nestjs/common';
import { DonationService } from '../services/donation.service';
import { CreateDonationDto } from '../dto/create-donation.dto';
import { PaymentMethod } from '../interfaces/payment.strategy';

@Controller('donation')
export class DonationController {
  constructor(private readonly service: DonationService) {}
  @Get()
  findAll() {
    return "this.service.findAll()";
  }
  @Post()
  create(@Body() dto: CreateDonationDto) {
    return this.service.create(dto);
  }
  @Get('validate/:id')
  validate(@Param('id') id: number) {
    return this.service.validateDonation(id);
  }
  @Post('capture/:orderId')
  captureDonation(
    @Param('orderId') orderId: string,
    @Query('method') method: PaymentMethod,
  ) {
    return this.service.capture(orderId, method);
}

}