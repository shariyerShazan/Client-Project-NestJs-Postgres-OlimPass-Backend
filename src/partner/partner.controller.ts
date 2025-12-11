// partner/partner.controller.ts
import { Controller, Post, Get, Param, Body, Delete } from '@nestjs/common';
import { PartnerService } from './partner.service';
import { CreatePartnerDto } from './dto/create-partner.dto';

@Controller('partners')
export class PartnerController {
  constructor(private service: PartnerService) {}

  @Post()
  async create(@Body() dto: CreatePartnerDto) {
    return this.service.create(dto);
  }

//   @Get()
//   async findAll() {
//     return this.service.findAll();
//   }

//   @Get(':id')
//   async findOne(@Param('id') id: string) {
//     return this.service.findOne(id);
//   }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
