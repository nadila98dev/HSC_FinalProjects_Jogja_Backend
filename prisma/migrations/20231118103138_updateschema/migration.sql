/*
  Warnings:

  - You are about to drop the column `src` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `cartId` on the `ordercart` table. All the data in the column will be lost.
  - Added the required column `totalCartPrice` to the `OrderCart` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ordercart` DROP FOREIGN KEY `OrderCart_cartId_fkey`;

-- AlterTable
ALTER TABLE `items` DROP COLUMN `src`,
    ADD COLUMN `image` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `ordercart` DROP COLUMN `cartId`,
    ADD COLUMN `totalCartPrice` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `_ItemsToOrderCart` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ItemsToOrderCart_AB_unique`(`A`, `B`),
    INDEX `_ItemsToOrderCart_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_ItemsToOrderCart` ADD CONSTRAINT `_ItemsToOrderCart_A_fkey` FOREIGN KEY (`A`) REFERENCES `Items`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ItemsToOrderCart` ADD CONSTRAINT `_ItemsToOrderCart_B_fkey` FOREIGN KEY (`B`) REFERENCES `OrderCart`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
