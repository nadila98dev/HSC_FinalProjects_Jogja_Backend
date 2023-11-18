/*
  Warnings:

  - You are about to drop the `_itemstoordercart` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `cartId` to the `OrderCart` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_itemstoordercart` DROP FOREIGN KEY `_ItemsToOrderCart_A_fkey`;

-- DropForeignKey
ALTER TABLE `_itemstoordercart` DROP FOREIGN KEY `_ItemsToOrderCart_B_fkey`;

-- AlterTable
ALTER TABLE `ordercart` ADD COLUMN `cartId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `_itemstoordercart`;

-- AddForeignKey
ALTER TABLE `OrderCart` ADD CONSTRAINT `OrderCart_cartId_fkey` FOREIGN KEY (`cartId`) REFERENCES `Cart`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
