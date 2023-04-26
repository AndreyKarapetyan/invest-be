import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Post, Put, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@invest-be/auth/guards/jwt-auth.guard';
import { LessonDeletionDto } from '@invest-be/common/dto/lesson-deletion.dto';
import { LessonDto } from '@invest-be/common/dto/lesson.dto';
import { LessonGetDto } from '@invest-be/common/dto/lesson-get.dto';
import { LessonService } from '@invest-be/lesson/lesson.service';
import { LessonUpdateDto } from '@invest-be/common/dto/lesson-update.dto';
import { Role } from '@prisma/client';
import { Roles } from '@invest-be/auth/decorators/role.decorator';
import { RolesGuard } from '@invest-be/auth/guards/role.guard';

@ApiTags('Lessons')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SuperAdmin)
@Controller('lessons')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post()
  async createLesson(@Body() lessonData: LessonDto) {
    return this.lessonService.createLesson(lessonData);
  }

  @Get()
  async getLesson(@Query() params: LessonGetDto) {
    return this.lessonService.getLessons(params);
  }

  @Put()
  async updateLesson(@Body() lessonData: LessonUpdateDto) {
    return this.lessonService.updateLesson(lessonData);
  }

  @Delete()
  async deleteLesson(@Body() details: LessonDeletionDto) {
    return this.lessonService.deleteLesson(details);
  }
}
