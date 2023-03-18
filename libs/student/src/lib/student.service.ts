import { Injectable } from '@nestjs/common';
import { PaginatedResponse } from '@invest-be/common/types/PaginatedResponse';
import { PrismaService } from '@invest-be/prisma/prisma.service';
import { StudentSuperAdminListDto } from '@invest-be/common/dto/student-superadmin-list.dto';
import { StudentSuperAdmin } from '@invest-be/common/types/student/student-superadmin';

@Injectable()
export class StudentService {
  constructor(private readonly prisma: PrismaService) {}

  async getStudentsSuperAdmin(
    studentFilter: StudentSuperAdminListDto,
  ): Promise<PaginatedResponse<StudentSuperAdmin>> {
    const {
      branch: { branchName },
      pagination: { take, skip },
    } = studentFilter;
    const count = await this.prisma.student.count({ where: { branchName } });
    const rawData = await this.prisma.student.findMany({
      where: { branchName },
      include: {
        group: {
          include: {
            teacher: {
              include: {
                user: true,
              },
            },
          },
        },
      },
      take,
      skip,
    });
    const students = rawData.map(
      ({ id, name, lastname, email, formalFee, actualFee, status, group }) => ({
        id,
        name,
        lastname,
        email,
        formalFee,
        actualFee,
        status,
        teacherName: group.teacher.user.name,
        teacherLastname: group.teacher.user.lastname,
      }),
    );
    const result = {
      take,
      skip,
      count,
      data: students,
    };
    return result;
  }
}
