import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@invest-be/prisma/prisma.service';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'lessonId', async: true })
@Injectable()
export class LessonValidator implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(value: number): Promise<boolean> {
    if (!value || typeof value !== 'number') {
      throw new BadRequestException('lessonId must be a number');
    }
    const lesson = await this.prisma.lesson.findUnique({ where: { id: value } });
    if (!lesson) {
      throw new BadRequestException(`Lesson not found!`);
    }
    return true;
  }
}

export function IsValidLesson(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: LessonValidator,
      async: true,
    });
  };
}
