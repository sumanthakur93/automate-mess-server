/*
  Warnings:

  - The primary key for the `mess_bill` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `mess_bill` DROP PRIMARY KEY,
    ADD PRIMARY KEY (`rollNumber`, `month`, `year`);
