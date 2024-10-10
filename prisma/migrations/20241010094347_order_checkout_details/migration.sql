-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "address" TEXT NOT NULL DEFAULT 'empty',
ADD COLUMN     "email" TEXT,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "phoneNumber" TEXT NOT NULL DEFAULT 'empty';
