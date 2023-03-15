import { StudentSuperAdmin } from '@invest-be/common/types/student/student-superadmin';
import { PaginatedResponse } from '@invest-be/common/types/PaginatedResponse';
import { PaginationInputDto } from '@invest-be/common/dto/Pagination.dto';
import { StudentService } from '@invest-be/student/student.service';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Students')
@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get('superadmin/:branchName')
  async getStudents(
    @Query() pagination: PaginationInputDto,
    @Param('branchName') branchName: string
  ): Promise<PaginatedResponse<StudentSuperAdmin>> {
    return this.studentService.getStudentsSuperAdmin(branchName, pagination);
  }
}
