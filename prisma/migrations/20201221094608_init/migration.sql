-- CreateTable
CREATE TABLE `Invitation` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `invitedUserId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InvitationCode` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Discount` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191),
    `code` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `valueType` VARCHAR(191) NOT NULL DEFAULT 'FIXED_AMOUNT',
    `draftOrderId` VARCHAR(191),
    `usedAt` DATETIME(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DraftOrderRelation` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `orderId` VARCHAR(191) NOT NULL,
    `draftOrderId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FeedbackSubmission` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `lineUserId` VARCHAR(191) NOT NULL,
    `submittedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
