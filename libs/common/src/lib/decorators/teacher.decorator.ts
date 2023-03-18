import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@invest-be/prisma/prisma.service';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'teacherId', async: true })
@Injectable()
export class TeacherValidator implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(value: number): Promise<boolean> {
    if (!value || typeof value !== 'number') {
      throw new BadRequestException('teacherId must be a number');
    }
    const teacher = await this.prisma.teacher.findUnique({ where: { id: value } });
    if (!teacher) {
      throw new BadRequestException(`Teacher not found!`);
    }
    return true;
  }
}

export function IsValidTeacher(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: TeacherValidator,
      async: true,
    });
  };
}
