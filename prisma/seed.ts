
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client';
import { categories } from './data/category/index.js';




const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({adapter});

async function main() {
    console.log('Seeding started');

 

    for (const category of categories) {
    await prisma.category.create({
      data: {
        name: category.name,
        partners: {
          create: category.partners,
        },
      },
    });
  }

  console.log('Seed completed');
}



main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
