// category/category.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCategoryDto) {
    try {
      const category = await this.prisma.category.create({
        data: {
          name: data.name,
          partners: {
            create: data.partners || [],
          },
        },
        include: { partners: true },
      });

      return {
        success: true,
        message: 'Category created successfully',
        data: category,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to create category',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll() {
    try {
      const categories = await this.prisma.category.findMany({
        include: { partners: true },
      });

      return {
        success: true,
        message: 'Categories fetched successfully',
        data: categories,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to fetch categories',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: string) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id },
        include: { partners: true },
      });

      if (!category) {
        throw new HttpException(
          {
            success: false,
            message: 'Category not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        message: 'Category fetched successfully',
        data: category,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        {
          success: false,
          message: 'Failed to fetch category',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async delete(id: string) {
    try {
      const category = await this.prisma.category.delete({
        where: { id },
      });

      return {
        success: true,
        message: 'Category deleted successfully',
        data: category,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to delete category',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
