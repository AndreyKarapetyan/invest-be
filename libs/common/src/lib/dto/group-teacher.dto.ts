import { IsInt } from 'class-validator';
import { IsValidTeacher } from '../decorators/teacher.decorator';
import { Type } from 'class-transformer';

export class GroupTeacherDto {
  @IsValidTeacher()
  @Type(() => Number)
  @IsInt()
  teacherId: number;
}
