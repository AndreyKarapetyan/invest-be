import { BranchDto } from '@invest-be/common/dto/branch.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@invest-be/prisma/prisma.service';
import { TeacherSuperAdmin } from '@invest-be/common/types/teacher/teacher-superadmin';
import { TeacherSuperAdminExtended } from '@invest-be/common/types/teacher/teacher-superadmin-extended';
import { Group } from '@prisma/client';

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
      ({ id, level, phoneNumber, salaryPercent, user: { name, lastname, email } }) => ({
        id,
        name,
        lastname,
        email,
        level,
        phoneNumber,
        salaryPercent,
      }),
    );
    return result;
  }

  async getTeacherById(teacherId: number): Promise<TeacherSuperAdminExtended> {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id: teacherId },
      include: {
        user: true,
        group: true,
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
      user: { name, lastname, email, password },
      group,
    } = teacher;
    const formattedGroups = group.reduce((acc: { [key: string]: Group }, item) => {
      acc[item.id] = item;
      return acc;
    }, {});
    const result = {
      id,
      name,
      lastname,
      email,
      password,
      level,
      phoneNumber,
      salaryPercent,
      groups: formattedGroups,
    };
    return result;
  }

  async deleteTeacher(id: number) {
    await this.prisma.teacher.delete({ where: { id } });
  }
}
