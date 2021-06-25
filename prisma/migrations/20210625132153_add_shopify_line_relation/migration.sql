-- CreateTable
CREATE TABLE `ShopifyUserLineUserRelation` (
    `shopifyUserId` VARCHAR(191) NOT NULL,
    `lineUserId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ShopifyUserLineUserRelation.shopifyUserId_unique`(`shopifyUserId`),
    INDEX `ShopifyUserLineUserRelation.shopifyUserId_index`(`shopifyUserId`),
    INDEX `ShopifyUserLineUserRelation.lineUserId_index`(`lineUserId`),
    UNIQUE INDEX `ShopifyUserLineUserRelation.shopifyUserId_lineUserId_unique`(`shopifyUserId`, `lineUserId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
