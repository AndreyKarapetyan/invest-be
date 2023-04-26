import { Roles } from '@invest-be/auth/decorators/role.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@invest-be/auth/guards/jwt-auth.guard';
import { PaginatedResponse } from '@invest-be/common/types/PaginatedResponse';
import { RolesGuard } from '@invest-be/auth/guards/role.guard';
import { StudentDto } from '@invest-be/common/dto/student.dto';
import { StudentService } from '@invest-be/student/student.service';
import { StudentSuperAdmin } from '@invest-be/common/types/student/student-superadmin';
import { StudentSuperAdminListDto } from '@invest-be/common/dto/student-superadmin-list.dto';
import { Role } from '@prisma/client';

@ApiBearerAuth()
@ApiTags('Students')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SuperAdmin)
@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get('superadmin')
  async getStudents(
    @Query() studentFilter: StudentSuperAdminListDto,
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
