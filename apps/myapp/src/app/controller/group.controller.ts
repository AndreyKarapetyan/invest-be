import { ApiTags } from '@nestjs/swagger';
import { BranchDto } from '@invest-be/common/dto/branch.dto';
import { Controller, Get, Query } from '@nestjs/common';
import { Group } from '@prisma/client';
import { GroupService } from '@invest-be/group/group.service';
import { GroupTeacherDto } from '@invest-be/common/dto/group-teacher.dto';

@ApiTags('Groups')
@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get()
  async getGroups(@Query() teacher: GroupTeacherDto): Promise<Group[]> {
    return this.groupService.getGroupsByTeacher(teacher);
  }
}
