import { Module } from '@nestjs/common';
import { StudentModule } from '@invest-be/student/student.module';
import { StudentController } from './controller/student.controller';
import { CommonModule } from '@invest-be/common/common.module';

@Module({
  imports: [StudentModule, CommonModule],
  controllers: [StudentController],
  providers: [],
})
export class AppModule {}
