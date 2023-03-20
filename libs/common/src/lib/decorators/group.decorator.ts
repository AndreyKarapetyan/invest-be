import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@invest-be/prisma/prisma.service';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'groupId', async: true })
@Injectable()
export class GroupIdValidator implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(value: number, { object }: ValidationArguments): Promise<boolean> {
    if (!value || typeof value !== 'number') {
      throw new BadRequestException('groupId must be a number');
    }
    if ((object as any).groupName || (object as any).teacherId) {
      throw new BadRequestException(
        'Invalid set of parameters: provided group id for existing group, but also parameter/s for a new group',
      );
    }
    const group = await this.prisma.group.findUnique({ where: { id: value } });
    if (!group) {
      throw new BadRequestException(`Teacher not found!`);
    }
    return true;
  }
}

export function IsValidGroup(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: GroupIdValidator,
      async: true,
    });
  };
}
