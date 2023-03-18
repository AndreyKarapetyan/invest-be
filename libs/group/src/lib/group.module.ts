import { GroupService } from './group.service';
import { CommonModule } from '@invest-be/common/common.module';
import { Module } from '@nestjs/common';
import { PrismaModule } from '@invest-be/prisma/prisma.module';

@Module({
  imports: [CommonModule, PrismaModule],
  providers: [GroupService],
  exports: [GroupService],
})
export class GroupModule {}
