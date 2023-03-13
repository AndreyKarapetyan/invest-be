import { PaginationInputDto } from '@invest-be/common/dto/input/Pagination.dto';
import { StudentSuperAdminOutputDto } from '@invest-be/common/dto/output/StudentSuperAdmin.dto';
import { PrismaService } from '@invest-be/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StudentService {
  constructor(private readonly prisma: PrismaService) {}

  async getStudentsSuperAdmin(
    branchName: string,
    pagination: PaginationInputDto
  ): Promise<StudentSuperAdminOutputDto[]> {
    const { skip, take } = pagination;
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
    return students;
  }
}
