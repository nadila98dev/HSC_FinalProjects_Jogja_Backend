/*
  Warnings:

  - You are about to drop the column `createdAt` on the `cart` table. All the data in the column will be lost.
  - You are about to drop the column `id_category` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `cartId` on the `ordercart` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `ordercart` table. All the data in the column will be lost.
  - You are about to drop the column `shipment_status` on the `ordercart` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `Cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `Items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cartData` to the `OrderCart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trxId` to the `OrderCart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `OrderCart` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `items` DROP FOREIGN KEY `Items_id_category_fkey`;

-- DropForeignKey
ALTER TABLE `ordercart` DROP FOREIGN KEY `OrderCart_cartId_fkey`;

-- AlterTable
ALTER TABLE `cart` DROP COLUMN `createdAt`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `category` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `items` DROP COLUMN `id_category`,
    ADD COLUMN `categoryId` INTEGER NOT NULL,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `ordercart` DROP COLUMN `cartId`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `shipment_status`,
    ADD COLUMN `cartData` VARCHAR(10000) NOT NULL,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `detetimePayment` DATETIME(3) NULL,
    ADD COLUMN `linkPayment` VARCHAR(191) NULL,
    ADD COLUMN `paymentType` VARCHAR(191) NULL,
    ADD COLUMN `statusOrder` ENUM('PENDING', 'PROCESS', 'SHIPPED', 'DELIVERED', 'FAILED') NOT NULL DEFAULT 'PENDING',
    ADD COLUMN `statusPayment` ENUM('PENDING', 'SUCCESS', 'FAILED') NOT NULL DEFAULT 'PENDING',
    ADD COLUMN `trxId` VARCHAR(191) NOT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `Saved` (
    `id` VARCHAR(191) NOT NULL,
    `itemsId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ItemsToOrderCart` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ItemsToOrderCart_AB_unique`(`A`, `B`),
    INDEX `_ItemsToOrderCart_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Items` ADD CONSTRAINT `Items_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Saved` ADD CONSTRAINT `Saved_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Saved` ADD CONSTRAINT `Saved_itemsId_fkey` FOREIGN KEY (`itemsId`) REFERENCES `Items`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ItemsToOrderCart` ADD CONSTRAINT `_ItemsToOrderCart_A_fkey` FOREIGN KEY (`A`) REFERENCES `Items`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ItemsToOrderCart` ADD CONSTRAINT `_ItemsToOrderCart_B_fkey` FOREIGN KEY (`B`) REFERENCES `OrderCart`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
