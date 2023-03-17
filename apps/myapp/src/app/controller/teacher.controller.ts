import { TeacherService } from '@invest-be/teacher/teacher.service';
import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Teachers')
@Controller('teachers')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Get('superadmin/:branchName')
  async getTechers(@Param('branchName') branchName: string) {
    return this.teacherService.getTeachers(branchName);
  }
}
