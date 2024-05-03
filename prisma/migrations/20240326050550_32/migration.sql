/*
  Warnings:

  - You are about to drop the column `entryId` on the `Exit` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Exit` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Exit" DROP CONSTRAINT "Exit_entryId_fkey";

-- DropForeignKey
ALTER TABLE "Exit" DROP CONSTRAINT "Exit_productId_fkey";

-- AlterTable
ALTER TABLE "Exit" DROP COLUMN "entryId",
DROP COLUMN "productId";
