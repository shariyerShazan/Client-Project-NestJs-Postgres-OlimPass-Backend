// partner/partner.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePartnerDto } from './dto/create-partner.dto';

@Injectable()
export class PartnerService {
  constructor(private prisma: PrismaService) {}

  create(data: CreatePartnerDto) {
    return this.prisma.partner.create({
      data,
    });
  }

  findAll() {
    return this.prisma.partner.findMany({
      include: { category: true },
    });
  }

  findOne(id: string) {
    return this.prisma.partner.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  delete(id: string) {
    return this.prisma.partner.delete({
      where: { id },
    });
  }
}
