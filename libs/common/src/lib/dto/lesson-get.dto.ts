import { IsDateString } from "class-validator";
import { IsValidBranch } from "../decorators/branch.decorator";

export class LessonGetDto {
  @IsValidBranch()
  branchName: string;

  @IsDateString()
  date: string;
}