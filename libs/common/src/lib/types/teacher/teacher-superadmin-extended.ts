import { Group } from '@prisma/client';
import { TeacherSuperAdmin } from './teacher-superadmin';

export interface TeacherSuperAdminExtended extends TeacherSuperAdmin {
  groups: {
    [key: string]: Group;
  };
}
