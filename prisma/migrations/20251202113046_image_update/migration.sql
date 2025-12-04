/*
  Warnings:

  - You are about to drop the column `profileImageId` on the `AgentProfile` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "AgentProfile" DROP CONSTRAINT "AgentProfile_profileImageId_fkey";

-- DropIndex
DROP INDEX "AgentProfile_profileImageId_key";

-- AlterTable
ALTER TABLE "AgentProfile" DROP COLUMN "profileImageId";
