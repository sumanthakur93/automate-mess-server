/*
  Warnings:

  - Added the required column `roles` to the `Admin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `admin` ADD COLUMN `roles` VARCHAR(191) NOT NULL;
