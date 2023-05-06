import { IsEnum, IsInt, IsPositive } from 'class-validator';
import { IsValidStudent } from '../decorators/student.decorator';
import { PaymentStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class PaymentDto {
  @IsValidStudent()
  @IsInt()
  @IsPositive()
  studentId: number;

  @IsPositive()
  @Type(() => Number)
  amount: number;

  @IsEnum(PaymentStatus)
  status: PaymentStatus;
}
