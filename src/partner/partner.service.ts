// partner/partner.service.ts
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePartnerDto } from './dto/create-partner.dto';

@Injectable()
export class PartnerService {
  constructor(private prisma: PrismaService) {}

  // Only create
async create(data: CreatePartnerDto) {
  try {
    // Check if category exists
    const category = await this.prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

        const existingPartner = await this.prisma.partner.findFirst({
      where: {
        categoryId: data.categoryId,
        name: data.name,
        discount: data.discount,
      },
    });

    if (existingPartner) {
        throw new NotFoundException('A partner with the same name and discount already exists in this category');
    }
    const partner = await this.prisma.partner.create({
      data: {
        name: data.name,
        discount: data.discount,
        maxRedeems: data.maxRedeems,
        // remainingRedeems: data.maxRedeems,
        category: {
          connect: { id: data.categoryId },
        },
      },
    });

    return {
      success: true,
      message: 'Partner created and added to category successfully',
      data: partner,
    };
  } catch (error) {
    if (error instanceof NotFoundException) throw error;
    throw new InternalServerErrorException('Failed to create partner');
  }
}


  // Only delete
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
      if (error.code === 'P2025') throw new NotFoundException('Partner not found');
      throw new InternalServerErrorException('Failed to delete partner');
    }
  }


    async findAll() {
    const partners = await this.prisma.partner.findMany({
      include: { category: true },
      orderBy: { name: "asc" },
    })

    return {
      success: true,
      message: "Partners fetched successfully",
      data: partners,
    }
  }
}
