import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@invest-be/prisma/prisma.service';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Branch } from '@prisma/client';
import { StudentDto } from '../dto/student.dto';

@ValidatorConstraint({ name: 'sameBranch', async: true })
@Injectable()
export class SameBranchValidator implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(value: string, { object }: ValidationArguments): Promise<boolean> {
    let branch: Branch;
    const { groupId, groupName, teacherId } = object as StudentDto;
    if (!groupId && !groupName && !teacherId) {
      return true;
    }
    if (groupId) {
      const group = await this.prisma.group.findUnique({
        where: {
          id: groupId,
        },
        include: {
          teacher: {
            include: {
              user: {
                include: {
                  branch: true,
                },
              },
            },
          },
        },
      });
      branch = group?.teacher?.user?.branch[0];
    } else if (teacherId && typeof teacherId === 'number') {
      const teacher = await this.prisma.teacher.findUnique({
        where: {
          id: teacherId,
        },
        include: {
          user: {
            include: {
              branch: true
            }
          }
        }
      });
      branch = teacher?.user?.branch[0];
    }
    if (!branch || branch.name !== value) {
      throw new BadRequestException('Input branchName is not the same as for provided entities');
    }
    return true;
  }
}

export function IsValidBranchCombination(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: SameBranchValidator,
      async: true,
    });
  };
}
