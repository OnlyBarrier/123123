/*
  Warnings:

  - You are about to drop the column `containerNumbers` on the `Entry` table. All the data in the column will be lost.
  - You are about to drop the column `dimensions` on the `Entry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Entry" DROP COLUMN "containerNumbers",
DROP COLUMN "dimensions";
