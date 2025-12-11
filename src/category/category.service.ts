// category/category.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateCategoryDto) {
    return this.prisma.category.create({
      data: {
        name: data.name,
        partners: {
          create: data.partners,
        },
      },
      include: { partners: true },
    });
  }

  findAll() {
    return this.prisma.category.findMany({
      include: { partners: true },
    });
  }

  findOne(id: string) {
    return this.prisma.category.findUnique({
      where: { id },
      include: { partners: true },
    });
  }

  delete(id: string) {
    return this.prisma.category.delete({
      where: { id },
    });
  }
}
