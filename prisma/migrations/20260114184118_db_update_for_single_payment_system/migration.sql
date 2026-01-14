/*
  Warnings:

  - The values [ADVANCE,FINAL] on the enum `PaymentType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `amountPaid` on the `Bb_booking` table. All the data in the column will be lost.
  - You are about to drop the column `balanceDue` on the `Bb_booking` table. All the data in the column will be lost.
  - You are about to drop the column `fullPaymentDueAt` on the `Bb_booking` table. All the data in the column will be lost.
  - You are about to drop the column `refundForId` on the `Bb_payment` table. All the data in the column will be lost.
  - You are about to drop the column `advancedPerPerson` on the `Bb_travelPackage` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[bookingId]` on the table `Bb_payment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PaymentType_new" AS ENUM ('BOOKING', 'REFUND');
ALTER TABLE "Bb_payment" ALTER COLUMN "type" TYPE "PaymentType_new" USING ("type"::text::"PaymentType_new");
ALTER TYPE "PaymentType" RENAME TO "PaymentType_old";
ALTER TYPE "PaymentType_new" RENAME TO "PaymentType";
DROP TYPE "public"."PaymentType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Bb_booking" DROP COLUMN "amountPaid",
DROP COLUMN "balanceDue",
DROP COLUMN "fullPaymentDueAt",
ALTER COLUMN "cancelledBy" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Bb_payment" DROP COLUMN "refundForId";

-- AlterTable
ALTER TABLE "Bb_travelPackage" DROP COLUMN "advancedPerPerson";

-- CreateIndex
CREATE UNIQUE INDEX "Bb_payment_bookingId_key" ON "Bb_payment"("bookingId");
