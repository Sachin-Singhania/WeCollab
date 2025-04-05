/*
  Warnings:

  - Added the required column `title` to the `YoutubeUpload` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "YoutubeUpload" ADD COLUMN     "title" TEXT NOT NULL;
