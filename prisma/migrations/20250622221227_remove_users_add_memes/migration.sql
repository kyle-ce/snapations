/*
  Warnings:

  - You are about to drop the `Caption` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Caption" DROP CONSTRAINT "Caption_userId_fkey";

-- DropTable
DROP TABLE "Caption";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Memes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "caption" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Memes_pkey" PRIMARY KEY ("id")
);
