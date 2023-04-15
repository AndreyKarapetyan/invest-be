import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BranchDto } from '@invest-be/common/dto/branch.dto';
import { TeacherDto } from '@invest-be/common/dto/teacher.dto';
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
    // await new Promise((res) => setTimeout(res, 10000))
    return this.teacherService.getTeacherById(teacherId);
  }

  @Post()
  async createTeacher(@Body() teacherData: TeacherDto): Promise<number> {
    // await new Promise((res) => setTimeout(res, 5000))
    return this.teacherService.createTeacher(teacherData);
  }

  @Put('/:teacherId')
  async updateStudent(@Body() teacherData: TeacherDto) {
    return this.teacherService.updateTeacher(teacherData);
  }

  @Delete('/:teacherId')
  async deleteTeacher(@Param('teacherId', ParseIntPipe) teacherId: number): Promise<void> {
    return this.teacherService.deleteTeacher(teacherId);
  }
}
