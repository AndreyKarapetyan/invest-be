import { IsValidTeacher } from '../decorators/teacher.decorator';
import { Type } from 'class-transformer';

export class GroupTeacherDto {
  @IsValidTeacher()
  @Type(() => Number)
  teacherId: number;
}
