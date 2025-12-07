/*
  Warnings:

  - You are about to drop the column `verified` on the `Bb_user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Bb_user" DROP COLUMN "verified",
ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false;
