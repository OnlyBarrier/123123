-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "daysToPay" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "Date" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Date_pkey" PRIMARY KEY ("id")
);
