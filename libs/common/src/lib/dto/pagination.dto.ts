import { Type } from 'class-transformer';
import { IsInt, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  take: number;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  skip: number;
}
