import { IsValidTeacher } from "../decorators/teacher.decorator";

export class GroupTeacherDto {
  @IsValidTeacher()
  teacherId: number;
}