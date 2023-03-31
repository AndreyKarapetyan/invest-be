-- DropForeignKey
ALTER TABLE `Payment` DROP FOREIGN KEY `Payment_studentId_fkey`;

-- AlterTable
ALTER TABLE `Payment` ADD COLUMN `studentFullName` VARCHAR(191) NULL,
    MODIFY `studentId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
