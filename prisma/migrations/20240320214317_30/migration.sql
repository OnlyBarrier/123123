/*
  Warnings:

  - You are about to drop the `Exit` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Exit" DROP CONSTRAINT "Exit_containerId_fkey";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "exitDate" TEXT DEFAULT '',
ADD COLUMN     "exitQuantity" INTEGER DEFAULT 0,
ALTER COLUMN "observations" SET DEFAULT 'none',
ALTER COLUMN "quantity" SET DEFAULT 0,
ALTER COLUMN "dimensions" SET DEFAULT 'none';

-- DropTable
DROP TABLE "Exit";
