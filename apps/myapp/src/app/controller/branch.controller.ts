import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Branch, Role } from '@prisma/client';
import { BranchService } from '@invest-be/branch/branch.service';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@invest-be/auth/guards/jwt-auth.guard';
import { Roles } from '@invest-be/auth/decorators/role.decorator';
import { RolesGuard } from '@invest-be/auth/guards/role.guard';

@ApiTags('Branches')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SuperAdmin)
@Controller('branches')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Get()
  async getBranches(): Promise<Branch[]> {
    return this.branchService.getBranches();
  }
}
