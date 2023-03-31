import { ApiTags } from '@nestjs/swagger';
import { BranchDto } from '@invest-be/common/dto/branch.dto';
import { Controller, Delete, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { TeacherService } from '@invest-be/teacher/teacher.service';
import { TeacherSuperAdmin } from '@invest-be/common/types/teacher/teacher-superadmin';

@ApiTags('Teachers')
@Controller('teachers')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Get('superadmin')
  async getTeachers(@Query() branch: BranchDto): Promise<TeacherSuperAdmin[]> {
    return this.teacherService.getTeachers(branch);
  }

  @Get('superadmin/:teacherId')
  async getTeacherById(@Param('teacherId', ParseIntPipe) teacherId: number) {
    return this.teacherService.getTeacherById(teacherId);
  }

  @Delete('/:teacherId')
  async deleteTeacher(@Param('teacherId', ParseIntPipe) teacherId: number): Promise<void> {
    return this.teacherService.deleteTeacher(teacherId);
  }
}
