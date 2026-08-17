-- AlterTable
ALTER TABLE "Supplier" ADD COLUMN "emails" TEXT[];

UPDATE "Supplier" SET "emails" = ARRAY["email"];

ALTER TABLE "Supplier" ALTER COLUMN "emails" SET NOT NULL;

ALTER TABLE "Supplier" DROP COLUMN "email";
