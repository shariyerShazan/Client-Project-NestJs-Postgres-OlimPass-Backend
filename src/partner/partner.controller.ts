// partner/partner.controller.ts
import { Controller, Post, Get, Param, Body, Delete, UseGuards } from '@nestjs/common';
import { PartnerService } from './partner.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('partners')
export class PartnerController {
  constructor(private service: PartnerService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
 @Roles('ADMIN')
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


  @UseGuards(AuthGuard('jwt'), RolesGuard)
 @Roles('ADMIN')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
