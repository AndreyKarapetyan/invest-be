import { PrismaModule } from '@invest-be/prisma/prisma.module';
import { PrismaService } from '@invest-be/prisma/prisma.service';
import { Module } from '@nestjs/common';
import { BranchValidator } from './decorators/branch.decorator';
import { TeacherValidator } from './decorators/teacher.decorator';

@Module({
  imports: [PrismaModule],
  providers: [BranchValidator, TeacherValidator, PrismaService],
  exports: [BranchValidator, TeacherValidator],
})
export class CommonModule {}
