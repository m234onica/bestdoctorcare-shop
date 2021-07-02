-- CreateTable
CREATE TABLE `EventLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191),
    `userId` VARCHAR(191),
    `payload` JSON,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `EventLog.type_index`(`type`),
    INDEX `EventLog.userId_index`(`userId`),
    INDEX `EventLog.productId_index`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
