import { ChangeMode } from '../types/lesson/changeMode';
import { IsEnum, IsIn, IsInt, IsDateString, Max, Min } from 'class-validator';
import { IsValidGroup } from '../decorators/group.decorator';
import { IsValidLesson } from '../decorators/lesson.decorator';
import { IsValidLessonRepetitionPattern } from '../decorators/lesson-repetition-pattern.decorator';

export class LessonUpdateDto {
  @IsValidLesson()
  id: number;

  @IsDateString()
  date: string;

  @IsInt()
  @Min(9)
  @Max(22)
  startHour: number;

  @IsIn([0, 15, 30, 45])
  startMinute: number;

  @Min(9)
  @Max(22)
  endHour: number;

  @IsIn([0, 15, 30, 45])
  endMinute: number;

  @IsValidLessonRepetitionPattern()
  pattern: string;

  @IsValidGroup()
  groupId: string;

  @IsEnum(ChangeMode)
  changeMode: ChangeMode;
}
