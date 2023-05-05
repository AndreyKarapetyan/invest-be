import { IsEnum, IsInt, IsPositive } from 'class-validator';
import { IsValidStudent } from '../decorators/student.decorator';
import { PaymentStatus } from '@prisma/client';

export class PaymentDto {
  @IsValidStudent()
  @IsInt()
  @IsPositive()
  studentId: number;

  @IsPositive()
  amount: number;

  @IsEnum(PaymentStatus)
  status: PaymentStatus;
}
