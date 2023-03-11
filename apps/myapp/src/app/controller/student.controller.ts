import { PaginationDto } from '@invest-be/common/dto/Pagination.dto';
import { StudentService } from '@invest-be/student/student.service';
import { Controller, Get, Query } from "@nestjs/common";

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  async getStudents(@Query() pagination: PaginationDto) {
    return this.studentService.getStudents(pagination);
  }
}