import { StudentSuperAdminListDto } from '@invest-be/common/dto/student-superadmin-list.dto';
import { StudentSuperAdmin } from '@invest-be/common/types/student/student-superadmin';
import { PaginatedResponse } from '@invest-be/common/types/PaginatedResponse';
import { StudentService } from '@invest-be/student/student.service';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Students')
@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get('superadmin')
  async getStudents(
    @Query() studentFilter: StudentSuperAdminListDto
  ): Promise<PaginatedResponse<StudentSuperAdmin>> {
    console.log(22222222222222222)
    return this.studentService.getStudentsSuperAdmin(studentFilter);
  }
}
