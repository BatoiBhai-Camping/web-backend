/*
  Warnings:

  - Made the column `country` on table `Address` required. This step will fail if there are existing NULL values in that column.
  - Made the column `state` on table `Address` required. This step will fail if there are existing NULL values in that column.
  - Made the column `district` on table `Address` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pin` on table `Address` required. This step will fail if there are existing NULL values in that column.
  - Made the column `city` on table `Address` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "country" SET NOT NULL,
ALTER COLUMN "state" SET NOT NULL,
ALTER COLUMN "district" SET NOT NULL,
ALTER COLUMN "pin" SET NOT NULL,
ALTER COLUMN "city" SET NOT NULL;
