import { Level } from '@prisma/client';

export interface TeacherSuperAdmin {
  id: number;
  name: string;
  lastname: string;
  password: string;
  level: Level;
  phoneNumber: string;
  salaryPercent: number;
}
