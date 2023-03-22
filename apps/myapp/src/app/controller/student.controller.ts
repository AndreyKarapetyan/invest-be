import { StudentDto } from '@invest-be/common/dto/student.dto';
import { StudentSuperAdminListDto } from '@invest-be/common/dto/student-superadmin-list.dto';
import { StudentSuperAdmin } from '@invest-be/common/types/student/student-superadmin';
import { PaginatedResponse } from '@invest-be/common/types/PaginatedResponse';
import { StudentService } from '@invest-be/student/student.service';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Students')
@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get('superadmin')
  async getStudents(
    @Query() studentFilter: StudentSuperAdminListDto
  ): Promise<PaginatedResponse<StudentSuperAdmin>> {
    return this.studentService.getStudentsSuperAdmin(studentFilter);
  }

  @Post()
  async createStudent(@Body() studentData: StudentDto) {
    return this.studentService.createStudent(studentData);
  }

  @Put('/:studentId')
  async updateStudent(@Body() studentData: StudentDto) {
    return this.studentService.updateStudent(studentData);
  }

  @Delete('/:studentId')
  async deleteStudent(@Param('studentId', ParseIntPipe) studentId: number): Promise<void> {
    return this.studentService.deleteStudent(studentId);
  }
}
