-- AlterTable
ALTER TABLE "Registration" ADD COLUMN     "otpAttemptCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "otpWindowStart" TIMESTAMP(3);
