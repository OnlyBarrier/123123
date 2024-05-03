/*
  Warnings:

  - Added the required column `nature` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethods` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiverType` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rucType` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "nature" TEXT NOT NULL,
ADD COLUMN     "paymentMethods" TEXT NOT NULL,
ADD COLUMN     "receiverType" TEXT NOT NULL,
ADD COLUMN     "rucType" TEXT NOT NULL;
