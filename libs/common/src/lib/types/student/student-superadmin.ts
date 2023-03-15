import { StudentStatus } from "@prisma/client";

export interface StudentSuperAdmin {
  id: number;
  name: string;
  lastname: string;
  email: string;
  formalFee: number;
  actualFee: number;
  status: StudentStatus;
  teacherName: string;
  teacherLastname: string;
}