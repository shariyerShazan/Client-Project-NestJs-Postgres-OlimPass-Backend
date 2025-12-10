/*
  Warnings:

  - A unique constraint covering the columns `[membershipId]` on the table `Registration` will be added. If there are existing duplicate values, this will fail.
  - Made the column `membershipId` on table `Registration` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Registration" ALTER COLUMN "membershipId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Registration_membershipId_key" ON "Registration"("membershipId");
