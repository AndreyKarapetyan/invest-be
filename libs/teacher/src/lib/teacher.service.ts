import { genSalt, hash } from 'bcrypt';
import { BranchDto } from '@invest-be/common/dto/branch.dto';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@invest-be/prisma/prisma.service';
import { TeacherSuperAdmin } from '@invest-be/common/types/teacher/teacher-superadmin';
import { TeacherSuperAdminExtended } from '@invest-be/common/types/teacher/teacher-superadmin-extended';
import { Group, Role } from '@prisma/client';
import { TeacherDto } from '@invest-be/common/dto/teacher.dto';

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
    const result = teachers.map(({ id, level, phoneNumber, salaryPercent, user: { name, lastname, email } }) => ({
      id,
      name,
      lastname,
      email,
      level,
      phoneNumber,
      salaryPercent,
    }));
    return result;
  }

  async getTeacherById(teacherId: number): Promise<TeacherSuperAdminExtended> {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id: teacherId },
      include: {
        user: {
          include: {
            branch: true,
          },
        },
        group: {
          include: {
            student: true,
          },
        },
      },
    });
    if (!teacher) {
      throw new NotFoundException();
    }
    const {
      id,
      level,
      phoneNumber,
      salaryPercent,
      user: { name, lastname, email, branch },
      group,
    } = teacher;
    const formattedGroups = group.reduce(
      (
        acc: { [key: string]: Partial<Group> & { students: { id: number; fullName: string }[] } },
        { id, name, student },
      ) => {
        acc[id] = {
          id,
          name,
          students: student.map(({ id, name, lastname }) => ({
            id,
            fullName: `${name} ${lastname}`,
          })),
        };
        return acc;
      },
      {},
    );
    const result = {
      id,
      name,
      lastname,
      email,
      level,
      phoneNumber,
      salaryPercent,
      branchName: branch[0].name,
      groups: formattedGroups,
    };
    return result;
  }

  async createTeacher(teacherData: TeacherDto): Promise<number> {
    const {
      name,
      lastname,
      email,
      password: rawPassword,
      branchName,
      level,
      phoneNumber,
      salaryPercent,
      groups,
    } = teacherData;
    if (!rawPassword) {
      throw new BadRequestException('Password must not be empty');
    }
    const password = await hash(rawPassword, await genSalt());
    const teacher = await this.prisma.user.create({
      data: {
        name,
        lastname,
        email,
        password,
        role: Role.Teacher,
        branch: {
          connect: {
            name: branchName,
          },
        },
        teacher: {
          create: {
            level,
            phoneNumber,
            salaryPercent,
          },
        },
      },
    });
    await this.prisma.$transaction(
      groups
        .filter(({ students }) => Boolean(students.length))
        .map(({ name, students }) => {
          return this.prisma.group.create({
            data: {
              teacher: {
                connect: {
                  id: teacher.id,
                },
              },
              name,
              student: {
                connect: students.map(({ id }) => ({ id })),
              },
            },
          });
        }),
    );
    return teacher.id;
  }

  async updateTeacher(teacherData: TeacherDto) {
    const { id, name, lastname, email, password: newPassword, level, phoneNumber, salaryPercent, groups } = teacherData;
    let password: string;
    if (newPassword) {
      password = await hash(newPassword, await genSalt());
    }
    const emptyGroups = groups.filter(({ students }) => !students.length);
    const emptyGroupIds = emptyGroups.map(({ id }) => id);
    const notEmptyGroups = groups.filter(({ students }) => students.length);
    const oldGroups = notEmptyGroups.filter(({ isNew }) => !isNew);
    const oldGroupIds = oldGroups.map(({ id }) => id);
    const newGroups = notEmptyGroups.filter(({ isNew }) => isNew);
    const newGroupIds = newGroups.map(({ id }) => id);
    const studentIds = groups.flatMap(({ students }) => students.map(({ id }) => id));
    const updateTeacherData = this.prisma.teacher.update({
      where: { id },
      data: {
        level,
        phoneNumber,
        salaryPercent,
        user: {
          update: {
            name,
            lastname,
            email,
            password,
          },
        },
        group: {
          deleteMany: {
            id: {
              notIn: oldGroupIds,
            },
          },
        },
      },
    });
    const removeStudentsFromGroups = this.prisma.student.updateMany({
      where: {
        id: {
          notIn: studentIds,
        },
        groupId: {
          in: oldGroupIds,
        },
      },
      data: {
        groupId: null,
      },
    });
    const connectStudentsToOldGroups = oldGroups.map(({ id, name, students }) => {
      return this.prisma.group.update({
        where: { id },
        data: {
          name,
          student: {
            connect: students.map(({ id }) => ({ id })),
          },
        },
      });
    });
    const createNewGroups = newGroups.map(({ name, students }) => {
      return this.prisma.group.create({
        data: {
          teacher: {
            connect: {
              id,
            },
          },
          name,
          student: {
            connect: students.map(({ id }) => ({ id })),
          },
        },
      });
    });
    const deleteEmptyGroups = this.prisma.group.deleteMany({
      where: {
        id: {
          in: emptyGroupIds,
        },
      },
    });
    await this.prisma.$transaction([
      updateTeacherData,
      removeStudentsFromGroups,
      deleteEmptyGroups,
      ...createNewGroups,
      ...connectStudentsToOldGroups,
    ]);
  }

  async deleteTeacher(id: number) {
    await this.prisma.teacher.delete({ where: { id } });
  }
}
