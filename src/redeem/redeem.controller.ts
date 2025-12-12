import { Body, Controller, Post } from '@nestjs/common';
import { RedeemService } from './redeem.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { RedeemDto } from './dto/redeem-dto';


@Controller('redeem')
export class RedeemController {
  constructor(private readonly redeemService: RedeemService) {}

  @Post('send-otp')
  sendOtp(@Body() dto: SendOtpDto) {
    return this.redeemService.sendOtp(dto.membershipId);
  }

  @Post()
  redeem(@Body() dto: RedeemDto) {
    return this.redeemService.redeem(dto.membershipId, dto.otp, dto.partnerId);
  }
}
