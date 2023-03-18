import { GroupTeacherDto } from '@invest-be/common/dto/group-teacher.dto';
import { PrismaService } from '@invest-be/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GroupService {
  constructor(private readonly prisma: PrismaService) {}

  async getGroupsByTeacher(teacher: GroupTeacherDto) {
    const { teacherId } = teacher;
    const groups = await this.prisma.group.findMany({ where: { teacherId } });
    return groups;
  }
}
