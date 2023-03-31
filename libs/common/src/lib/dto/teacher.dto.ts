import { AreValidGroups } from '../decorators/teacher-groups.decorator';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsStrongPassword,
  ValidateNested,
} from 'class-validator';
import { IsValidBranch } from '../decorators/branch.decorator';
import { IsValidGroup } from '../decorators/group.decorator';
import { IsValidTeacher } from '../decorators/teacher.decorator';
import { Level } from '@prisma/client';
import { Type } from 'class-transformer';

class StudentDto {
  @IsPositive()
  @IsInt()
  id: number;
}

export class GroupDto {
  @IsOptional()
  @IsValidGroup()
  id?: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @ValidateNested({ each: true })
  @Type(() => StudentDto)
  students: StudentDto[];
}

export class TeacherDto {
  @IsValidTeacher()
  @Type(() => Number)
  @IsOptional()
  id?: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsEnum(Level)
  level: Level;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsPositive()
  salaryPercent: number;

  @IsValidBranch()
  branchName: string;

  @AreValidGroups()
  @ValidateNested({ each: true })
  @Type(() => GroupDto)
  groups: GroupDto[];
}
