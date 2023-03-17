import { BranchService } from '@invest-be/branch/branch.service';
import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Branch } from '@prisma/client';

@ApiTags('Branches')
@Controller('branches')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Get()
  async getBranches(): Promise<Branch[]> {
    return this.branchService.getBranches();
  }
}