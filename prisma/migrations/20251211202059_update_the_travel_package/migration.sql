/*
  Warnings:

  - Added the required column `seatsAvailable` to the `Bb_travelPackage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalSeats` to the `Bb_travelPackage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bb_travelPackage" ADD COLUMN     "seatBooked" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "seatsAvailable" INTEGER NOT NULL,
ADD COLUMN     "totalSeats" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Bb_travelPackage" ADD CONSTRAINT "Bb_travelPackage_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Bb_agentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
