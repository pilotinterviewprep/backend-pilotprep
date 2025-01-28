-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('GOOGLE', 'FACEBOOK', 'APPLE', 'MANUAL');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "provider" "Provider" NOT NULL DEFAULT 'MANUAL';
