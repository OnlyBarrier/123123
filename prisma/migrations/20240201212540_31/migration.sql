-- DropIndex
DROP INDEX "Container_containerNumber_key";

-- AlterTable
ALTER TABLE "Container" ADD COLUMN     "address" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "departureDate" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "email" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "phone" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "containerNumber" SET DEFAULT '';

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "dayValue" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "freeDays" TEXT NOT NULL DEFAULT '';
