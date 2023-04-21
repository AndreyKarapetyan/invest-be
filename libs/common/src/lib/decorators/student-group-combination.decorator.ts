import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@invest-be/prisma/prisma.service';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { StudentDto } from '../dto/student.dto';

@ValidatorConstraint({ name: 'groupCombination', async: true })
@Injectable()
export class GroupDataCombinationValidator implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(_value: number, { object }: ValidationArguments): Promise<boolean> {
    const { groupId, groupName, teacherId } = object as StudentDto;
    const isValid =
      (!groupId && !groupName && !teacherId) ||
      (typeof groupId === 'string' && !groupName) ||
      (!groupId && typeof teacherId === 'number' && groupName && typeof groupName === 'string');
    if (!isValid) {
      throw new BadRequestException(
        `Incorrect set of group parameters: groupId: ${groupId}, groupName: ${groupName}, teacherId: ${teacherId}. Either provide nothing, or only existing groupId, or create a new group and provide groupName and teacherId`,
      );
    }
    return true;
  }
}

export function IsValidGroupDataCombination(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: GroupDataCombinationValidator,
      async: true,
    });
  };
}
