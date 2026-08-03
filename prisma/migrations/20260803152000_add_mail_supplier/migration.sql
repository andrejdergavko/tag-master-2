-- AlterTable
ALTER TABLE "Mail" ADD COLUMN "supplierId" TEXT;

-- Backfill from existing documents
UPDATE "Mail" m
SET "supplierId" = d."supplierId"
FROM "Document" d
WHERE d."mailId" = m."id";

-- AlterTable
ALTER TABLE "Mail" ALTER COLUMN "supplierId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Mail" ADD CONSTRAINT "Mail_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
