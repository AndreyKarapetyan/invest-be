import { ChangeMode } from '../types/lesson/changeMode';
import { IsEnum, IsDateString, IsOptional } from 'class-validator';
import { IsValidLesson } from '../decorators/lesson.decorator';

export class LessonDeletionDto {
  @IsValidLesson()
  id: number;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsEnum(ChangeMode)
  changeMode: ChangeMode;
}
