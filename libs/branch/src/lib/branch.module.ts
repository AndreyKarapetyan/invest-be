import { BranchService } from './branch.service';
import { PrismaModule } from '@invest-be/prisma/prisma.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule],
  providers: [BranchService],
  exports: [BranchService],
})
export class BranchModule {}
