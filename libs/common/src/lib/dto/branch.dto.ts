import { IsValidBranch } from "../decorators/branch.decorator";

export class BranchDto {
  @IsValidBranch()
  branchName: string;
}