import { IsDateString, IsIn, IsInt, Max, Min } from 'class-validator';
import { IsValidGroup } from '../decorators/group.decorator';
import { IsValidLessonRepetitionPattern } from '../decorators/lesson-repetition-pattern.decorator';
import { IsValidRoom } from '../decorators/room.decorator';

export class LessonDto {
  @IsDateString()
  date: Date;

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

  @IsValidRoom()
  roomId: number;
}
