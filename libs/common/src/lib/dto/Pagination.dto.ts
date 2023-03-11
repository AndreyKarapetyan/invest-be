import { IsInt, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @IsInt()
  @IsPositive()
  take: number;

  @IsInt()
  @Min(0)
  skip: number;
}
