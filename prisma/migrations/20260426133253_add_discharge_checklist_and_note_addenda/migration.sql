-- AlterEnum
ALTER TYPE "ClinicalNoteType" ADD VALUE 'ADDENDUM';

-- AlterTable
ALTER TABLE "clinical_notes" ADD COLUMN     "parentNoteId" TEXT;

-- AlterTable
ALTER TABLE "encounters" ADD COLUMN     "dischargeChecklist" JSONB;

-- CreateIndex
CREATE INDEX "clinical_notes_parentNoteId_idx" ON "clinical_notes"("parentNoteId");

-- AddForeignKey
ALTER TABLE "clinical_notes" ADD CONSTRAINT "clinical_notes_parentNoteId_fkey" FOREIGN KEY ("parentNoteId") REFERENCES "clinical_notes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
