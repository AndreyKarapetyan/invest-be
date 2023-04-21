import { BranchValidator } from './decorators/branch.decorator';
import { GroupDataCombinationValidator } from './decorators/student-group-combination.decorator';
import { GroupIdValidator } from './decorators/group.decorator';
import { Module } from '@nestjs/common';
import { PrismaModule } from '@invest-be/prisma/prisma.module';
import { SameBranchValidator } from './decorators/student-same-branch.decorator';
import { TeacherGroupsValidator } from './decorators/teacher-groups.decorator';
import { TeacherValidator } from './decorators/teacher.decorator';
import { RoomValidator } from './decorators/room.decorator';
import { LessonValidator } from './decorators/lesson.decorator';
import { LessonRepetitionPatternValidator } from './decorators/lesson-repetition-pattern.decorator';

@Module({
  imports: [PrismaModule],
  providers: [
    BranchValidator,
    TeacherValidator,
    GroupIdValidator,
    GroupDataCombinationValidator,
    SameBranchValidator,
    TeacherGroupsValidator,
    RoomValidator,
    LessonValidator,
    LessonRepetitionPatternValidator,
  ],
  exports: [
    BranchValidator,
    TeacherValidator,
    GroupIdValidator,
    GroupDataCombinationValidator,
    SameBranchValidator,
    TeacherGroupsValidator,
    RoomValidator,
    LessonValidator,
    LessonRepetitionPatternValidator,
  ],
})
export class CommonModule {}
