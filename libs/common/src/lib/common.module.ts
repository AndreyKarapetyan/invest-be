import { BranchValidator } from './decorators/branch.decorator';
import { GroupDataCombinationValidator } from './decorators/student-group-combination.decorator';
import { GroupIdValidator } from './decorators/group.decorator';
import { Module } from '@nestjs/common';
import { PrismaModule } from '@invest-be/prisma/prisma.module';
import { PrismaService } from '@invest-be/prisma/prisma.service';
import { SameBranchValidator } from './decorators/student-same-branch.decorator';
import { TeacherValidator } from './decorators/teacher.decorator';

@Module({
  imports: [PrismaModule],
  providers: [
    BranchValidator,
    TeacherValidator,
    GroupIdValidator,
    GroupDataCombinationValidator,
    SameBranchValidator,
  ],
  exports: [
    BranchValidator,
    TeacherValidator,
    GroupIdValidator,
    GroupDataCombinationValidator,
    SameBranchValidator,
  ],
})
export class CommonModule {}
