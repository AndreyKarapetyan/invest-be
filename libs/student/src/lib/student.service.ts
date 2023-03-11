import { PaginationInputDto } from '@invest-be/common/dto/input/Pagination.dto';
import { PrismaService } from '@invest-be/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StudentService {
  constructor(private readonly prisma: PrismaService) {}

  async getStudents(pagination: PaginationInputDto, branches = ['Artashat']) {
    const { skip, take } = pagination;
    const students = await this.prisma.student.findMany({
      where: {
        branchName: {
          in: branches,
        },
      },
      include: {
        group: {
          include: {
            teacher: true
          }
        }
      },
      take,
      skip,
    });
  }
}
