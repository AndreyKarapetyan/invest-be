import { PrismaModule } from '@invest-be/prisma/prisma.module';
import { Module } from "@nestjs/common";
import { LessonService } from './lesson.service';

@Module({
  imports: [PrismaModule],
  providers: [LessonService],
  exports: [LessonService],
})
export class LessonModule {}
