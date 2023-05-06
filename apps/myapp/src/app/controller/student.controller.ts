import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@invest-be/auth/guards/jwt-auth.guard';
import { ListDto } from '@invest-be/common/dto/list.dto';
import { PaginatedResponse } from '@invest-be/common/types/PaginatedResponse';
import { Role } from '@prisma/client';
import { Roles } from '@invest-be/auth/decorators/role.decorator';
import { RolesGuard } from '@invest-be/auth/guards/role.guard';
import { StudentDto } from '@invest-be/common/dto/student.dto';
import { StudentGetMinDataDto } from '@invest-be/common/dto/student-get.dto';
import { StudentService } from '@invest-be/student/student.service';
import { StudentSuperAdmin } from '@invest-be/common/types/student/student-superadmin';

@ApiTags('Students')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SuperAdmin)
@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get('superadmin')
  async getStudents(@Query() studentFilter: ListDto): Promise<PaginatedResponse<StudentSuperAdmin>> {
    return this.studentService.getStudentsSuperAdmin(studentFilter);
  }

  @Get()
  async getAllStudentsMinData(@Query() filter: StudentGetMinDataDto) {
    return this.studentService.getAllStudentsMinData(filter);
  }

  @Post()
  async createStudent(@Body() studentData: StudentDto): Promise<void> {
    return this.studentService.createStudent(studentData);
  }

  @Put('/:studentId')
  async updateStudent(@Body() studentData: StudentDto): Promise<void> {
    return this.studentService.updateStudent(studentData);
  }

  @Delete('/:studentId')
  async deleteStudent(@Param('studentId', ParseIntPipe) studentId: number): Promise<void> {
    return this.studentService.deleteStudent(studentId);
  }
}
