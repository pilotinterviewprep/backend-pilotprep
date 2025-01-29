/*
  Warnings:

  - You are about to drop the column `contact_number` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.
  - Added the required column `first_name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "users_contact_number_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "contact_number",
DROP COLUMN "name",
ADD COLUMN     "country" TEXT,
ADD COLUMN     "first_name" TEXT NOT NULL,
ADD COLUMN     "last_name" TEXT,
ADD COLUMN     "username" TEXT NOT NULL;
