/*
  Warnings:

  - You are about to drop the column `tax` on the `Invoice` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "tax",
ADD COLUMN     "address" TEXT NOT NULL DEFAULT 'none',
ADD COLUMN     "eInvoiceCreated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "emails" TEXT NOT NULL DEFAULT 'none',
ADD COLUMN     "telephones" TEXT NOT NULL DEFAULT 'none';

-- CreateTable
CREATE TABLE "Items" (
    "id" TEXT NOT NULL,
    "idInvoice" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "tax" TEXT NOT NULL DEFAULT '0',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Items" ADD CONSTRAINT "Items_idInvoice_fkey" FOREIGN KEY ("idInvoice") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
