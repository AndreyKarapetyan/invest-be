import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { IsValidBranch } from '../decorators/branch.decorator';
import { IsValidGroup } from '../decorators/group.decorator';
import { IsValidTeacher } from '../decorators/teacher.decorator';
import { Type } from 'class-transformer';

export class StudentGetMinDataDto {
  @IsValidBranch()
  branchName: string;

  @IsValidGroup()
  @IsOptional()
  @IsString()
  groupId?: string;

  @IsValidTeacher()
  @IsOptional()
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  teacherId?: number;
}
