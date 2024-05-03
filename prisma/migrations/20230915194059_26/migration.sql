-- DropIndex
DROP INDEX "Invoice_userId_key";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "customerName" TEXT NOT NULL DEFAULT 'none',
ADD COLUMN     "ruc" TEXT NOT NULL DEFAULT 'none';
