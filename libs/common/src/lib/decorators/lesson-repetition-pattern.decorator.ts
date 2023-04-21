import { BadRequestException, Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'repetition-pattern' })
@Injectable()
export class LessonRepetitionPatternValidator implements ValidatorConstraintInterface {
  async validate(value: string): Promise<boolean> {
    if (!value || typeof value !== 'string') {
      throw new BadRequestException('repetition pattern must be a string');
    }
    if (value === 'once') {
      return true;
    }
    const weekDays = [1, 2, 3, 4, 5, 6, 7];
    const isValid = value.split(',').every((item) => weekDays.includes(Number(item)));
    if (!isValid) {
      throw new BadRequestException(
        `Incorrect repetition pattern. Need to specify comma separated week days`,
      );
    }
    return true;
  }
}

export function IsValidLessonRepetitionPattern(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: LessonRepetitionPatternValidator,
      async: true,
    });
  };
}
