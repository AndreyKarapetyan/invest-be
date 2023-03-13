import { PaginationInputDto } from '@invest-be/common/dto/input/Pagination.dto';
import { StudentSuperAdminOutputDto } from '@invest-be/common/dto/output/StudentSuperAdmin.dto';
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
  ): Promise<StudentSuperAdminOutputDto[]> {
    return this.studentService.getStudentsSuperAdmin(branchName, pagination);
  }
}
