-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_assignedAgentId_fkey";

-- AlterTable
ALTER TABLE "Ticket" ALTER COLUMN "assignedAgentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_assignedAgentId_fkey" FOREIGN KEY ("assignedAgentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
