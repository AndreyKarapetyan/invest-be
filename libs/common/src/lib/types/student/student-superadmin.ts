import { StudentStatus } from "@prisma/client";

export interface StudentSuperAdmin {
  id: number;
  name: string;
  lastname: string;
  email: string;
  formalFee: number;
  actualFee: number;
  status: StudentStatus;
  teacherId: number;
  teacherFullName: string;
  groupName: string;
}