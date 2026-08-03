-- CreateTable
CREATE TABLE "Mail" (
    "id" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mail_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "Document" ADD COLUMN "mailId" TEXT;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_mailId_fkey" FOREIGN KEY ("mailId") REFERENCES "Mail"("id") ON DELETE SET NULL ON UPDATE CASCADE;
