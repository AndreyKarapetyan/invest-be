import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
} from 'class-validator';
import { StudentStatus } from '@prisma/client';

export class StudentSuperAdminOutputDto {
  @IsInt()
  @IsPositive()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsEmail()
  email: string;

  @IsInt()
  @IsPositive()
  formalFee: number;

  @IsInt()
  @IsPositive()
  actualFee: number;

  @IsEnum(StudentStatus)
  status: StudentStatus;

  @IsString()
  @IsNotEmpty()
  teacherName: string;

  @IsString()
  @IsNotEmpty()
  teacherLastname: string;
}
