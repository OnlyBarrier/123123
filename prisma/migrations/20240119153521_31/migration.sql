-- DropIndex
DROP INDEX "Invoice_blNumber_key";

-- CreateTable
CREATE TABLE "Exit" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "observations" TEXT,
    "dimensions" TEXT,
    "quantity" INTEGER NOT NULL,
    "blNumber" TEXT NOT NULL,
    "ruc" TEXT NOT NULL DEFAULT 'none',
    "customerName" TEXT NOT NULL DEFAULT 'none',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "containerId" TEXT NOT NULL,

    CONSTRAINT "Exit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Exit_blNumber_key" ON "Exit"("blNumber");

-- AddForeignKey
ALTER TABLE "Exit" ADD CONSTRAINT "Exit_containerId_fkey" FOREIGN KEY ("containerId") REFERENCES "Container"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
