/*
  Warnings:

  - You are about to drop the column `draftOrderId` on the `Discount` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Discount` DROP COLUMN `draftOrderId`,
    ADD COLUMN `orderId` VARCHAR(191);
