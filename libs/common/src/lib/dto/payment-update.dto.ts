import { IsEnum } from 'class-validator';
import { PaymentStatus } from '@prisma/client';

export class PaymentUpdateDto {
  @IsEnum(PaymentStatus)
  status: PaymentStatus;
}
