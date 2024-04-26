/*
  Warnings:

  - Added the required column `razorpay_signature` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `transaction` ADD COLUMN `razorpay_signature` VARCHAR(191) NOT NULL;
