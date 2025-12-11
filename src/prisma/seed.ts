import { PrismaClient } from "@prisma/client/extension";


const prisma = new PrismaClient();

async function main() {
    console.log('Seeding started');

  const categories = [
    {
      name: 'Fitness & Sports',
      partners: [
        { name: 'Golf Caesarea', discount: '15% off first 3 visits' },
        { name: 'Tazuz', discount: '15 NIS off each league sign up' },
        { name: 'Gordon Pool', discount: 'Free Day Pass + 1 guest' },
        { name: 'Playground', discount: '1st Group Class Free' },
        { name: 'Yoga with Davida', discount: '1st Group Class Free' },
        { name: 'Fight TLV', discount: '10% off first 3 classes' },
        { name: 'The Bloc Climbing Gym', discount: '10% off any purchase/visit' },
        { name: 'TLV Bikes', discount: '100 NIS off any bike purchase' },
        { name: 'Karki Store', discount: '250 NIS off scooter purchase' },
      ],
    },
    {
      name: 'Beauty & Wellness',
      partners: [
        { name: 'Odelia Ben Hur Cosmetics', discount: '20% off first 3 visits' },
        { name: 'Tel Aviv Acupuncture', discount: '15% off first visit' },
        { name: 'OnCurl Salon', discount: '50 NIS off first appointment' },
        { name: 'Kim HeadSpa', discount: 'Extra 30 min free with treatment' },
        { name: 'Fire&Ice', discount: '15% off first 3 visits' },
        { name: 'SigellT Waxing and Laser', discount: '25% off first 3 visits' },
      ],
    },
    {
      name: 'Activities',
      partners: [
        { name: 'Golf Caesarea', discount: '10% off first Round' },
        { name: 'ClayforTLV', discount: '10% off first 3 pottery pieces' },
        { name: 'Citrus&Salt Cooking', discount: '270 NIS vs. 310 NIS' },
        { name: 'Topsea Surfing Center', discount: 'First Rental Free' },
      ],
    },
    {
      name: 'Travel & Accommodations',
      partners: [
        { name: 'Hotel Drensgoff', discount: '10% off first stay (min 2 nights)' },
        { name: 'SunCar', discount: '10% off first 3 rentals' },
        { name: 'Best Car Rental', discount: '100 NIS off first rental' },
      ],
    },
    {
      name: 'Food & Drinks',
      partners: [
        { name: 'Tal Miznon', discount: '10% off with membership' },
        { name: 'Opa Pizza', discount: '10% off per visit' },
        { name: 'Nomadic Wellness', discount: '10% off one time visit or membership' },
      ],
    },
  ];

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
