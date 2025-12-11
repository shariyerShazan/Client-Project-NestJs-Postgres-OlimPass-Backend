// partner/partner.service.ts
import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePartnerDto } from './dto/create-partner.dto';

@Injectable()
export class PartnerService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePartnerDto) {
    try {
      const partner = await this.prisma.partner.create({ data });

      return {
        success: true,
        message: 'Partner created successfully',
        data: partner,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to create partner');
    }
  }

  async findAll() {
    try {
      const partners = await this.prisma.partner.findMany({
        include: { category: true },
      });

      return {
        success: true,
        message: 'Partners fetched successfully',
        data: partners,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch partners');
    }
  }

  async findOne(id: string) {
    try {
      const partner = await this.prisma.partner.findUnique({
        where: { id },
        include: { category: true },
      });

      if (!partner) {
        throw new NotFoundException('Partner not found');
      }

      return {
        success: true,
        message: 'Partner fetched successfully',
        data: partner,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch partner');
    }
  }

  async delete(id: string) {
    try {
      const partner = await this.prisma.partner.delete({
        where: { id },
      });

      return {
        success: true,
        message: 'Partner deleted successfully',
        data: partner,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        // Prisma record not found
        throw new NotFoundException('Partner not found');
      }

      throw new InternalServerErrorException('Failed to delete partner');
    }
  }
}
