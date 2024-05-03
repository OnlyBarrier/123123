/*
  Warnings:

  - You are about to drop the column `exitQuantity` on the `Exit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Exit" DROP COLUMN "exitQuantity",
ADD COLUMN     "date" TEXT,
ADD COLUMN     "driverName" TEXT,
ADD COLUMN     "exitType" TEXT NOT NULL DEFAULT '1',
ADD COLUMN     "quantity" TEXT DEFAULT '',
ADD COLUMN     "transCompany" TEXT,
ADD COLUMN     "truckPlate" TEXT;
