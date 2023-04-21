import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@invest-be/prisma/prisma.service';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'branchName', async: true })
@Injectable()
export class BranchValidator implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(value: string): Promise<boolean> {
    if (!value || typeof value !== 'string') {
      throw new BadRequestException('branchName must be a string');
    }
    const branches = await this.prisma.branch.findMany();
    const branchNames = branches.map(({ name }) => name);
    if (!branchNames.includes(value)) {
      throw new BadRequestException(`Branch must be one of: ${branchNames.join(', ')}`);
    }
    return true;
  }
}

export function IsValidBranch(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: BranchValidator,
      async: true,
    });
  };
}
