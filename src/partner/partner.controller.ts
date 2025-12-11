// partner/partner.controller.ts
import { Controller, Post, Get, Param, Body, Delete } from '@nestjs/common';
import { PartnerService } from './partner.service';
import { CreatePartnerDto } from './dto/create-partner.dto';

@Controller('partners')
export class PartnerController {
  constructor(private service: PartnerService) {}

  @Post()
  create(@Body() dto: CreatePartnerDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
