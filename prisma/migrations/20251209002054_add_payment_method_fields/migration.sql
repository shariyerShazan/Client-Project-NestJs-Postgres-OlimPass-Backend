-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "cardNumber" TEXT,
ADD COLUMN     "cardholderName" TEXT,
ADD COLUMN     "cvc" TEXT,
ADD COLUMN     "expireDate" TEXT,
ALTER COLUMN "stripeSessionId" DROP NOT NULL;
