import { BranchDto } from '@invest-be/common/dto/branch.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@invest-be/prisma/prisma.service';
import { TeacherSuperAdmin } from '@invest-be/common/types/teacher/teacher-superadmin';

@Injectable()
export class TeacherService {
  constructor(private readonly prisma: PrismaService) {}

  async getTeachers(branch: BranchDto): Promise<TeacherSuperAdmin[]> {
    const { branchName } = branch;
    const teachers = await this.prisma.teacher.findMany({
      where: {
        user: {
          branch: {
            some: {
              name: branchName,
            },
          },
        },
      },
      include: {
        user: true,
      },
    });
    const result = teachers.map(
      ({ id, level, phoneNumber, salaryPercent, user: { name, lastname, password } }) => ({
        id,
        name,
        lastname,
        password,
        level,
        phoneNumber,
        salaryPercent,
      }),
    );
    return result;
  }
}
