import { LessonGetDto } from '@invest-be/common/dto/lesson-get.dto';
import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Post, Put, Query } from '@nestjs/common';
import { LessonDeletionDto } from '@invest-be/common/dto/lesson-deletion.dto';
import { LessonDto } from '@invest-be/common/dto/lesson.dto';
import { LessonService } from '@invest-be/lesson/lesson.service';
import { LessonUpdateDto } from '@invest-be/common/dto/lesson-update.dto';

@ApiTags('Lessons')
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
