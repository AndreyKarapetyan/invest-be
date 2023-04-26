import { BranchController } from './controller/branch.controller';
import { BranchModule } from '@invest-be/branch/branch.module';
import { CommonModule } from '@invest-be/common/common.module';
import { GroupController } from './controller/group.controller';
import { GroupModule } from '@invest-be/group/group.module';
import { Module } from '@nestjs/common';
import { StudentController } from './controller/student.controller';
import { StudentModule } from '@invest-be/student/student.module';
import { TeacherController } from './controller/teacher.controller';
import { LessonModule } from '@invest-be/lesson/lesson.module';
import { TeacherModule } from '@invest-be/teacher/teacher.module';
import { LessonController } from './controller/lesson.controller';
import { AuthModule } from '@invest-be/auth/auth.module';
import { AuthController } from './controller/auth.controller';

@Module({
  imports: [
    StudentModule,
    CommonModule,
    BranchModule,
    TeacherModule,
    GroupModule,
    LessonModule,
    AuthModule
  ],
  controllers: [
    StudentController,
    BranchController,
    TeacherController,
    GroupController,
    LessonController,
    AuthController
  ],
})
export class AppModule {}
