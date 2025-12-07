-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'ROOTADMIN';

-- AlterTable
ALTER TABLE "Bb_user" ADD COLUMN     "roleStatus" "AgentStatus";
