/*
  Warnings:

  - You are about to drop the column `status` on the `Bb_agentProfile` table. All the data in the column will be lost.
  - The `roleStatus` column on the `Bb_user` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "RoleStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Bb_agentProfile" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "Bb_user" DROP COLUMN "roleStatus",
ADD COLUMN     "roleStatus" "RoleStatus";

-- DropEnum
DROP TYPE "AgentStatus";
