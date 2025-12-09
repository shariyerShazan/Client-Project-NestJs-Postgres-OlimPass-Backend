-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "method" TEXT;

-- AlterTable
ALTER TABLE "Registration" ALTER COLUMN "paymentMethod" DROP NOT NULL;
