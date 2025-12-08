import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { RedeemService } from './redeem.service';

@Controller('redeem')
export class RedeemController {
  constructor(private redeemService: RedeemService) {}

  @Get('categories')
  async getCategories() {
    return this.redeemService.getCategoriesWithPartners();
  }

  @Post()
  async redeem(@Body() body: { membershipId: string; partnerId: string }) {
    const { membershipId, partnerId } = body;
    const redeem = await this.redeemService.redeemDiscount(membershipId, partnerId);
    return {
      message: 'Discount redeemed successfully!',
      redeem,
    };
  }
}
