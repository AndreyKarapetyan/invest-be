import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@invest-be/prisma/prisma.service';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'studentId', async: true })
@Injectable()
export class StudentValidator implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(value: number): Promise<boolean> {
    if (!value || typeof value !== 'number') {
      throw new BadRequestException('studentId must be a number');
    }
    const student = await this.prisma.student.findUnique({ where: { id: value } });
    if (!student) {
      throw new BadRequestException(`Student not found!`);
    }
    return true;
  }
}

export function IsValidStudent(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: StudentValidator,
      async: true,
    });
  };
}
