import { Payment } from '@prisma/client';

export type PaymentSuperAdmin = Pick<
  Payment,
  | 'id'
  | 'amount'
  | 'groupName'
  | 'status'
  | 'studentId'
  | 'studentName'
  | 'studentLastname'
  | 'teacherName'
  | 'teacherLastname'
> & { createdAt: string };
