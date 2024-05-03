/*
  Warnings:

  - You are about to drop the column `description` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `Invoice` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "description",
DROP COLUMN "value";
