import { PrismaService } from '@invest-be/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Branch } from '@prisma/client';

@Injectable()
export class BranchService {
  constructor(private readonly prisma: PrismaService) {}

  async getBranches(): Promise<Branch[]> {
    return this.prisma.branch.findMany({
      include: {
        room: true,
      },
    });
  }

  async createBranch(branchName: string) {
    await this.prisma.branch.create({
      data: {
        name: branchName,
        user: {
          connect: {
            id: 6511516165151624,
          },
        },
      },
    });
  }
}
