import { TeacherService } from './teacher.service';
import { PrismaModule } from '@invest-be/prisma/prisma.module';
import { CommonModule } from '@invest-be/common/common.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [CommonModule, PrismaModule],
  providers: [TeacherService],
  exports: [TeacherService],
})
export class TeacherModule {}
