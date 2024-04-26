/*
  Warnings:

  - The primary key for the `transaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `transactionId` on the `transaction` table. All the data in the column will be lost.
  - Added the required column `razorpay_order_id` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `razorpay_payment_id` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `transaction` DROP PRIMARY KEY,
    DROP COLUMN `transactionId`,
    ADD COLUMN `razorpay_order_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `razorpay_payment_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`razorpay_order_id`);
