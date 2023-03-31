-- DropForeignKey
ALTER TABLE `Payment` DROP FOREIGN KEY `Payment_studentId_fkey`;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
