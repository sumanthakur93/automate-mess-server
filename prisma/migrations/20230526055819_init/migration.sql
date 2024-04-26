/*
  Warnings:

  - Added the required column `studentId` to the `Mess_Bill` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `mess_bill` DROP FOREIGN KEY `Mess_Bill_rollNumber_fkey`;

-- AlterTable
ALTER TABLE `mess_bill` ADD COLUMN `studentId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Mess_Bill` ADD CONSTRAINT `Mess_Bill_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`rollNumber`) ON DELETE RESTRICT ON UPDATE CASCADE;
