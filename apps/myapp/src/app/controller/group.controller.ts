import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Group, Role } from '@prisma/client';
import { GroupService } from '@invest-be/group/group.service';
import { GroupTeacherDto } from '@invest-be/common/dto/group-teacher.dto';
import { JwtAuthGuard } from '@invest-be/auth/guards/jwt-auth.guard';
import { Roles } from '@invest-be/auth/decorators/role.decorator';
import { RolesGuard } from '@invest-be/auth/guards/role.guard';

@ApiTags('Groups')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SuperAdmin)
@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get()
  async getGroups(@Query() teacher: GroupTeacherDto): Promise<Group[]> {
    return this.groupService.getGroupsByTeacher(teacher);
  }
}
