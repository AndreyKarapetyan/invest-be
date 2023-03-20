import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { IsValidBranch } from '../decorators/branch.decorator';
import { IsValidGroup } from '../decorators/group.decorator';
import { IsValidGroupDataCombination } from '../decorators/student-group-combination.decorator';
import { StudentStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsValidBranchCombination } from '../decorators/student-same-branch.decorator';

export class StudentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsEnum(StudentStatus)
  status: StudentStatus;

  @IsInt()
  @IsPositive()
  actualFee: number;

  @IsInt()
  @IsPositive()
  formalFee: number;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsValidGroup()
  @Type(() => Number)
  @IsOptional()
  @IsValidGroupDataCombination()
  groupId?: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @IsValidGroupDataCombination()
  groupName?: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  @IsValidGroupDataCombination()
  teacherId?: number;

  @IsValidBranch()
  @IsValidBranchCombination()
  branchName: string;
}
