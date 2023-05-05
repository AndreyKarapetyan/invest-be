import { AuthController } from './controller/auth.controller';
import { AuthModule } from '@invest-be/auth/auth.module';
import { BranchController } from './controller/branch.controller';
import { BranchModule } from '@invest-be/branch/branch.module';
import { CommonModule } from '@invest-be/common/common.module';
import { GroupController } from './controller/group.controller';
import { GroupModule } from '@invest-be/group/group.module';
import { LessonController } from './controller/lesson.controller';
import { LessonModule } from '@invest-be/lesson/lesson.module';
import { Module } from '@nestjs/common';
import { PaymentModule } from '@invest-be/payment/payment.module';
import { StudentController } from './controller/student.controller';
import { StudentModule } from '@invest-be/student/student.module';
import { TeacherController } from './controller/teacher.controller';
import { TeacherModule } from '@invest-be/teacher/teacher.module';
import { PaymentController } from './controller/payment.controller';

@Module({
  imports: [
    StudentModule,
    CommonModule,
    BranchModule,
    TeacherModule,
    GroupModule,
    LessonModule,
    AuthModule,
    PaymentModule,
  ],
  controllers: [
    StudentController,
    BranchController,
    TeacherController,
    GroupController,
    LessonController,
    AuthController,
    PaymentController,
  ],
})
export class AppModule {}
