/*
  Warnings:

  - You are about to drop the column `exitDate` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `exitQuantity` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "exitDate",
DROP COLUMN "exitQuantity";

-- CreateTable
CREATE TABLE "Exit" (
    "id" TEXT NOT NULL,
    "exitQuantity" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "entryId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "Exit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Exit" ADD CONSTRAINT "Exit_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "Entry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exit" ADD CONSTRAINT "Exit_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
