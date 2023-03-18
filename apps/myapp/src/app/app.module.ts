import { BranchController } from './controller/branch.controller';
import { BranchModule } from '@invest-be/branch/branch.module';
import { CommonModule } from '@invest-be/common/common.module';
import { GroupModule } from '@invest-be/group/group.module';
import { Module } from '@nestjs/common';
import { StudentController } from './controller/student.controller';
import { StudentModule } from '@invest-be/student/student.module';
import { TeacherController } from './controller/teacher.controller';
import { TeacherModule } from '@invest-be/teacher/teacher.module';

@Module({
  imports: [StudentModule, CommonModule, BranchModule, TeacherModule, GroupModule],
  controllers: [StudentController, BranchController, TeacherController],
  providers: [],
})
export class AppModule {}
