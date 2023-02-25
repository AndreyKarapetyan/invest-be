import { PrismaService } from '@invest-be/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async getData() {
    const c = await this.prisma.user.create({
      data: {
        name: 'some name'
      }
    })
    return { message: c };
  }
}
