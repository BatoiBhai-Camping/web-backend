/*
  Warnings:

  - You are about to drop the column `paymentStatus` on the `Bb_booking` table. All the data in the column will be lost.
  - You are about to drop the column `taxAmount` on the `Bb_booking` table. All the data in the column will be lost.
  - You are about to drop the column `isRefund` on the `Bb_payment` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Bb_payment` table. All the data in the column will be lost.
  - You are about to drop the column `bookingActiveFrom` on the `Bb_travelPackage` table. All the data in the column will be lost.
  - You are about to drop the column `bookingEndAt` on the `Bb_travelPackage` table. All the data in the column will be lost.
  - You are about to drop the column `cancellationPolicies` on the `Bb_travelPackage` table. All the data in the column will be lost.
  - You are about to drop the column `discountAmount` on the `Bb_travelPackage` table. All the data in the column will be lost.
  - You are about to drop the column `packagePolicies` on the `Bb_travelPackage` table. All the data in the column will be lost.
  - You are about to drop the column `seatBooked` on the `Bb_travelPackage` table. All the data in the column will be lost.
  - You are about to drop the column `taxPercentage` on the `Bb_travelPackage` table. All the data in the column will be lost.
  - You are about to drop the column `withTax` on the `Bb_travelPackage` table. All the data in the column will be lost.
  - You are about to drop the `Bb_hotelStay` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Bb_meal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Bb_mealPlan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Bb_transport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Bb_visitPlace` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Bb_address` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[travelPackageId]` on the table `Bb_address` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[paymentRef]` on the table `Bb_payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `pricePerPerson` to the `Bb_booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentRef` to the `Bb_payment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CARD', 'UPI', 'WALLET', 'NET_BANKING', 'BANK_TRANSFER');

-- CreateEnum
CREATE TYPE "PackageType" AS ENUM ('MULTI_DAY', 'DAILY');

-- DropForeignKey
ALTER TABLE "Bb_hotelStay" DROP CONSTRAINT "Bb_hotelStay_itineraryDayId_fkey";

-- DropForeignKey
ALTER TABLE "Bb_meal" DROP CONSTRAINT "Bb_meal_mealPlanId_fkey";

-- DropForeignKey
ALTER TABLE "Bb_mealPlan" DROP CONSTRAINT "Bb_mealPlan_itineraryDayId_fkey";

-- DropForeignKey
ALTER TABLE "Bb_payment" DROP CONSTRAINT "Bb_payment_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "Bb_transport" DROP CONSTRAINT "Bb_transport_itineraryDayId_fkey";

-- DropForeignKey
ALTER TABLE "Bb_visitPlace" DROP CONSTRAINT "Bb_visitPlace_itineraryDayId_fkey";

-- DropIndex
DROP INDEX "Bb_payment_bookingId_key";

-- AlterTable
ALTER TABLE "Bb_booking" DROP COLUMN "paymentStatus",
DROP COLUMN "taxAmount",
ADD COLUMN     "discountPercentage" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "gstAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "gstPercentage" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "pricePerPerson" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "visiteDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Bb_payment" DROP COLUMN "isRefund",
DROP COLUMN "type",
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "method" "PaymentMethod" NOT NULL DEFAULT 'CARD',
ADD COLUMN     "paymentRef" TEXT NOT NULL,
ADD COLUMN     "processedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Bb_travelPackage" DROP COLUMN "bookingActiveFrom",
DROP COLUMN "bookingEndAt",
DROP COLUMN "cancellationPolicies",
DROP COLUMN "discountAmount",
DROP COLUMN "packagePolicies",
DROP COLUMN "seatBooked",
DROP COLUMN "taxPercentage",
DROP COLUMN "withTax",
ADD COLUMN     "gstPercentage" INTEGER DEFAULT 0,
ADD COLUMN     "packageType" "PackageType" NOT NULL DEFAULT 'DAILY',
ADD COLUMN     "seatsBooked" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "Bb_hotelStay";

-- DropTable
DROP TABLE "Bb_meal";

-- DropTable
DROP TABLE "Bb_mealPlan";

-- DropTable
DROP TABLE "Bb_transport";

-- DropTable
DROP TABLE "Bb_visitPlace";

-- CreateIndex
CREATE UNIQUE INDEX "Bb_address_userId_key" ON "Bb_address"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Bb_address_travelPackageId_key" ON "Bb_address"("travelPackageId");

-- CreateIndex
CREATE UNIQUE INDEX "Bb_payment_paymentRef_key" ON "Bb_payment"("paymentRef");

-- CreateIndex
CREATE INDEX "Bb_payment_bookingId_idx" ON "Bb_payment"("bookingId");

-- CreateIndex
CREATE INDEX "Bb_payment_status_idx" ON "Bb_payment"("status");

-- AddForeignKey
ALTER TABLE "Bb_payment" ADD CONSTRAINT "Bb_payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Bb_booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
