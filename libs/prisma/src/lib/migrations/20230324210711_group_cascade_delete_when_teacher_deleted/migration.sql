-- DropForeignKey
ALTER TABLE `Group` DROP FOREIGN KEY `Group_teacherId_fkey`;

-- AddForeignKey
ALTER TABLE `Group` ADD CONSTRAINT `Group_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `Teacher`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
