import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@invest-be/prisma/prisma.service';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { GroupDto, TeacherDto } from '../dto/teacher.dto';

@ValidatorConstraint({ name: 'groups', async: true })
@Injectable()
export class TeacherGroupsValidator implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(groups: GroupDto[], { object }: ValidationArguments): Promise<boolean> {
    if (!Array.isArray(groups)) {
      throw new BadRequestException('groups must be an array');
    }
    const groupIds = groups.filter(({ id, isNew }) => Boolean(id) && !isNew).map(({ id }) => id);
    if (groupIds.length) {
      const groupCount = await this.prisma.group.count({
        where: {
          id: {
            in: groupIds,
          },
        },
      });
      if (groupIds.length !== groupCount) {
        throw new NotFoundException('Some groups do not exist');
      }
    }
    const students = groups.map(({ students }) => students);
    if (students.some((stundetArr) => !Array.isArray(stundetArr))) {
      throw new BadRequestException('students in groups must be arrays');
    }
    const stundentIds = students.flatMap((studentArr) => studentArr.map(({ id }) => id));
    if (stundentIds.length) {
      const dbStudents = await this.prisma.student.findMany({
        where: {
          id: {
            in: stundentIds,
          },
        },
      });
      if (stundentIds.length !== dbStudents.length) {
        throw new NotFoundException('Some students do not exist');
      }
      if (dbStudents.some(({ branchName }) => branchName !== (object as TeacherDto).branchName)) {
        throw new BadRequestException('Teacher and students must be in the same branch');
      }
    }
    return true;
  }
}

export function AreValidGroups(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: TeacherGroupsValidator,
      async: true,
    });
  };
}
