import { Injectable } from '@nestjs/common';
import { PaginatedResponse } from '@invest-be/common/types/PaginatedResponse';
import { PrismaService } from '@invest-be/prisma/prisma.service';
import { StudentDto } from '@invest-be/common/dto/student.dto';
import { StudentSuperAdmin } from '@invest-be/common/types/student/student-superadmin';
import { StudentSuperAdminListDto } from '@invest-be/common/dto/student-superadmin-list.dto';

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
      orderBy: {
        createdAt: 'desc',
      },
      take,
      skip,
    });
    const students = rawData.map(
      ({ id, name, lastname, email, formalFee, actualFee, status, group }) => ({
        id,
        name,
        lastname,
        fullName: `${name} ${lastname}`,
        email,
        formalFee,
        actualFee,
        status,
        teacherId: group?.teacher?.id,
        teacherFullName: group?.teacher?.user?.name && group?.teacher?.user?.lastname && `${group?.teacher?.user?.name} ${group?.teacher?.user?.lastname}`,
        groupId: group?.id,
        branchName,
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

  async createStudent(studentData: StudentDto): Promise<void> {
    const {
      actualFee,
      formalFee,
      lastname,
      name,
      status,
      email,
      groupId,
      groupName,
      teacherId,
      branchName,
    } = studentData;
    const student = await this.prisma.student.create({
      data: {
        name,
        lastname,
        actualFee,
        formalFee,
        branch: {
          connect: {
            name: branchName,
          },
        },
        email,
        status,
      },
    });
    if (groupId) {
      await this.prisma.student.update({
        data: {
          group: {
            connect: {
              id: groupId,
            },
          },
        },
        where: {
          id: student.id,
        },
      });
    } else if (groupName && teacherId) {
      await this.prisma.student.update({
        data: {
          group: {
            create: {
              name: groupName,
              teacher: {
                connect: {
                  id: teacherId,
                },
              },
            },
          },
        },
        where: {
          id: student.id,
        },
      });
    }
  }

  async updateStudent(studentData: StudentDto): Promise<void> {
    const {
      id,
      actualFee,
      formalFee,
      lastname,
      name,
      status,
      email,
      groupId,
      groupName,
      teacherId,
      branchName,
    } = studentData;
    await this.prisma.student.update({
      where: {
        id,
      },
      data: {
        name,
        lastname,
        actualFee,
        formalFee,
        branchName,
        email,
        status,
      },
    });
    if (groupId) {
      await this.prisma.student.update({
        data: {
          group: {
            connect: {
              id: groupId,
            },
          },
        },
        where: {
          id,
        },
      });
    } else {
      await this.prisma.student.update({
        data: {
          group: {
            disconnect: true,
          },
        },
        where: {
          id,
        },
      });
    }
    if (groupName && teacherId) {
      await this.prisma.student.update({
        data: {
          group: {
            create: {
              name: groupName,
              teacher: {
                connect: {
                  id: teacherId,
                },
              },
            },
          },
        },
        where: {
          id,
        },
      });
    }
  }

  async deleteStudent(id: number): Promise<void> {
    await this.prisma.student.delete({ where: { id } });
  }
}
