import { BranchDto } from './branch.dto';
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { PaginationDto } from './pagination.dto';
import { Type } from 'class-transformer';

export class ListDto {
  @IsNotEmpty()
  @Type(() => BranchDto)
  @ValidateNested()
  branch: BranchDto;

  @IsNotEmpty()
  @Type(() => PaginationDto)
  @ValidateNested()
  pagination: PaginationDto;

  @IsOptional()
  @IsString()
  search?: string;
}
