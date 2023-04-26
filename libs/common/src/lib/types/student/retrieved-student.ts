import { Student } from '@prisma/client';

export interface RetrievedStudent extends Student {
  teacherName: string;
  teacherLastname: string;
  teacherId: number;
  groupId: string;
}
