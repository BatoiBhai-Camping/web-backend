-- CreateEnum
CREATE TYPE "PackageApprovedStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Bb_travelPackage" ADD COLUMN     "packageApprovedStatus" "PackageApprovedStatus" NOT NULL DEFAULT 'PENDING';
