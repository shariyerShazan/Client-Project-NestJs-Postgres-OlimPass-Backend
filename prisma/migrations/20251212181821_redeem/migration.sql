/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Redeem` table. All the data in the column will be lost.
  - You are about to drop the column `otp` on the `Redeem` table. All the data in the column will be lost.
  - You are about to drop the column `otpAttemptCount` on the `Redeem` table. All the data in the column will be lost.
  - You are about to drop the column `otpExpiresAt` on the `Redeem` table. All the data in the column will be lost.
  - You are about to drop the column `otpLastAttemptAt` on the `Redeem` table. All the data in the column will be lost.
  - You are about to drop the column `otpVerified` on the `Redeem` table. All the data in the column will be lost.
  - You are about to drop the column `otpWindowStart` on the `Redeem` table. All the data in the column will be lost.
  - Made the column `redeemedAt` on table `Redeem` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Redeem" DROP COLUMN "createdAt",
DROP COLUMN "otp",
DROP COLUMN "otpAttemptCount",
DROP COLUMN "otpExpiresAt",
DROP COLUMN "otpLastAttemptAt",
DROP COLUMN "otpVerified",
DROP COLUMN "otpWindowStart",
ALTER COLUMN "redeemedAt" SET NOT NULL,
ALTER COLUMN "redeemedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Registration" ADD COLUMN     "otp" TEXT,
ADD COLUMN     "otpExpiresAt" TIMESTAMP(3);
