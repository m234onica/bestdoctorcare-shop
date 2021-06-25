-- CreateTable
CREATE TABLE `ShopifyUserLineUserRelation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `shopifyUserId` VARCHAR(191) NOT NULL,
    `lineUserId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ShopifyUserId_LineUserId_index`(`shopifyUserId`, `lineUserId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
