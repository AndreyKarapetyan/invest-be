import { Injectable } from '@nestjs/common';
import { PaginatedResponse } from '@invest-be/common/types/PaginatedResponse';
import { PaginationInputDto } from '@invest-be/common/dto/Pagination.dto';
import { PrismaService } from '@invest-be/prisma/prisma.service';
import { StudentSuperAdmin } from '@invest-be/common/types/student/student-superadmin';

@Injectable()
export class StudentService {
  constructor(private readonly prisma: PrismaService) {}

  async getStudentsSuperAdmin(
    branchName: string,
    pagination: PaginationInputDto
  ): Promise<PaginatedResponse<StudentSuperAdmin>> {
    const { skip, take } = pagination;
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
      })
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
