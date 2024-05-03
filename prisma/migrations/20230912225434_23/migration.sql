/*
  Warnings:

  - You are about to drop the column `blNumber` on the `Container` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[containerNumber]` on the table `Container` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `containerNumber` to the `Container` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Container_blNumber_key";

-- AlterTable
ALTER TABLE "Container" DROP COLUMN "blNumber",
ADD COLUMN     "containerNumber" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Container_containerNumber_key" ON "Container"("containerNumber");
