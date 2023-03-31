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
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  @IsOptional()
  id?: number;

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
  @Type(() => Number)
  actualFee: number;

  @IsInt()
  @IsPositive()
  @Type(() => Number)
  formalFee: number;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsValidGroup()
  @IsOptional()
  @IsValidGroupDataCombination()
  groupId?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @IsValidGroupDataCombination()
  groupName?: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  @IsValidGroupDataCombination()
  @Type(() => Number)
  teacherId?: number;

  @IsValidBranch()
  @IsValidBranchCombination()
  branchName: string;
}
