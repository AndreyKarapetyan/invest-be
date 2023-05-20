import { PrismaService } from '@invest-be/prisma/prisma.service';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { seed } from '../../../../../libs/prisma/src/lib/seed';
import { JwtAuthGuard } from '@invest-be/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@invest-be/auth/guards/role.guard';
import { Roles } from '@invest-be/auth/decorators/role.decorator';
import { Role } from '@prisma/client';

@ApiTags('Health')
@Controller()
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async check() {
    // await this.prisma.$queryRaw`SELECT 1`;
    return process.env.TEST;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  @Get('seed')
  async seed() {
    await seed();
  }
}
