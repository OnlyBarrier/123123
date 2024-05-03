/*
  Warnings:

  - A unique constraint covering the columns `[blNumber]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `blNumber` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "blNumber" TEXT NOT NULL,
ADD COLUMN     "dimensions" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Product_blNumber_key" ON "Product"("blNumber");
