import { CommonModule } from '@invest-be/common/common.module';
import { Module } from '@nestjs/common';
import { PrismaModule } from '@invest-be/prisma/prisma.module';
import { StudentService } from './student.service';

@Module({
  imports: [PrismaModule, CommonModule],
  providers: [StudentService],
  exports: [StudentService],
})
export class StudentModule {}
