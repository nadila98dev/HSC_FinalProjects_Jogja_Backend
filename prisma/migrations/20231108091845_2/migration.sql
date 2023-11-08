-- CreateTable
CREATE TABLE `Items` (
    `id` VARCHAR(191) NOT NULL,
    `id_category` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `src` VARCHAR(191) NULL,
    `price` INTEGER NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Items_id_category_key`(`id_category`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
