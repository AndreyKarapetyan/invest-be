import { BranchDto } from './branch.dto';
import { PaginationDto } from './pagination.dto';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, ValidateNested } from 'class-validator';

export class StudentSuperAdminListDto {
  @IsNotEmpty()
  @Type(() => BranchDto)
  @ValidateNested()
  branch: BranchDto;

  @IsNotEmpty()
  @Type(() => PaginationDto)
  @ValidateNested()
  pagination: PaginationDto;
}
