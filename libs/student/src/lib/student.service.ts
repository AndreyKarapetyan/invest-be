import { Injectable } from '@nestjs/common';
import { ListDto } from '@invest-be/common/dto/list.dto';
import { PaginatedResponse } from '@invest-be/common/types/PaginatedResponse';
import { PrismaService } from '@invest-be/prisma/prisma.service';
import { RetrievedStudent } from '@invest-be/common/types/student/retrieved-student';
import { StudentDto } from '@invest-be/common/dto/student.dto';
import { StudentGetMinDataDto } from '@invest-be/common/dto/student-get.dto';
import { StudentSuperAdmin } from '@invest-be/common/types/student/student-superadmin';

@Injectable()
export class StudentService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllStudentsMinData(filter: StudentGetMinDataDto) {
    const { groupId, teacherId, branchName } = filter;
    const students = await this.prisma.student.findMany({
      select: {
        id: true,
        name: true,
        lastname: true,
      },
      where: {
        branchName,
        groupId,
        group: {
          teacherId,
        },
      },
    });
    return students;
  }

  async getStudentsSuperAdmin(studentFilter: ListDto): Promise<PaginatedResponse<StudentSuperAdmin>> {
    const {
      branch: { branchName },
      pagination: { take, skip },
      search,
    } = studentFilter;
    let students: StudentSuperAdmin[];
    let count: number;
    if (search) {
      const rawCount = await this.prisma.$queryRaw<{ count: number }[]>`
        SELECT COUNT(DISTINCT(S.id)) as count
        FROM Student S
        LEFT JOIN \`Group\` G ON S.groupId = G.id
        INNER JOIN Teacher T ON G.teacherId = T.id
        INNER JOIN User U ON T.id = U.id
        WHERE 
          S.branchName = ${branchName} AND
          (
            S.id LIKE ${'%' + search + '%'} OR
            S.name LIKE ${'%' + search + '%'} OR
            S.lastname LIKE ${'%' + search + '%'} OR
            S.status LIKE ${'%' + search + '%'} OR
            S.formalFee LIKE ${'%' + search + '%'} OR
            S.actualFee LIKE ${'%' + search + '%'} OR
            U.name LIKE ${'%' + search + '%'} OR
            U.lastname LIKE ${'%' + search + '%'}
          )
      `;
      count = Number(rawCount[0]?.count);
      const retrievedStudents = await this.prisma.$queryRaw<RetrievedStudent[]>`
        SELECT 
          S.*,
          T.id as teacherId,
          U.name as teacherName,
          U.lastname as teacherLastname,
          G.id as groupId
        FROM Student S
        LEFT JOIN \`Group\` G ON S.groupId = G.id
        INNER JOIN Teacher T ON G.teacherId = T.id
        INNER JOIN User U ON T.id = U.id
        WHERE 
          S.branchName = ${branchName} AND
          (
            S.id LIKE ${'%' + search + '%'} OR
            S.name LIKE ${'%' + search + '%'} OR
            S.lastname LIKE ${'%' + search + '%'} OR
            S.status LIKE ${'%' + search + '%'} OR
            S.formalFee LIKE ${'%' + search + '%'} OR
            S.actualFee LIKE ${'%' + search + '%'} OR
            U.name LIKE ${'%' + search + '%'} OR
            U.lastname LIKE ${'%' + search + '%'}
          )
        ORDER BY S.createdAt DESC
        LIMIT ${take} OFFSET ${skip}
      `;
      students = retrievedStudents.map(
        ({
          id,
          name,
          lastname,
          email,
          formalFee,
          actualFee,
          status,
          groupId,
          teacherId,
          teacherName,
          teacherLastname,
        }) => ({
          id,
          name,
          lastname,
          email,
          status,
          fullName: `${name} ${lastname}`,
          actualFee,
          formalFee,
          groupId,
          teacherId,
          teacherFullName: teacherName && teacherLastname && `${teacherName} ${teacherLastname}`,
        }),
      );
    } else {
      count = await this.prisma.student.count({
        where: {
          branchName,
        },
      });
      const rawData = await this.prisma.student.findMany({
        where: {
          branchName,
        },
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
      students = rawData.map(({ id, name, lastname, email, formalFee, actualFee, status, group }) => ({
        id,
        name,
        lastname,
        fullName: `${name} ${lastname}`,
        email,
        formalFee,
        actualFee,
        status,
        teacherId: group?.teacher?.id,
        teacherFullName:
          group?.teacher?.user?.name &&
          group?.teacher?.user?.lastname &&
          `${group?.teacher?.user?.name} ${group?.teacher?.user?.lastname}`,
        groupId: group?.id,
        branchName,
      }));
    }
    const result = {
      take,
      skip,
      count,
      data: students,
    };
    return result;
  }

  async createStudent(studentData: StudentDto): Promise<void> {
    const { actualFee, formalFee, lastname, name, status, email, groupId, groupName, teacherId, branchName } =
      studentData;
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
    const { id, actualFee, formalFee, lastname, name, status, email, groupId, groupName, teacherId, branchName } =
      studentData;
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
