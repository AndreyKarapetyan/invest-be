import { PaginationInputDto } from '@invest-be/common/dto/input/Pagination.dto';
import { StudentService } from '@invest-be/student/student.service';
import { Controller, Get, Query } from "@nestjs/common";
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Students')
@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  async getStudents(@Query() pagination: PaginationInputDto) {
    return this.studentService.getStudents(pagination);
  }
}