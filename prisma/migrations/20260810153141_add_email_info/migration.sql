/*
  Warnings:

  - Added the required column `attachmentPart` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mailboxPath` to the `Mail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `messageId` to the `Mail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uid` to the `Mail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "attachmentPart" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Mail" ADD COLUMN     "mailboxPath" TEXT NOT NULL,
ADD COLUMN     "messageId" TEXT NOT NULL,
ADD COLUMN     "uid" INTEGER NOT NULL;
