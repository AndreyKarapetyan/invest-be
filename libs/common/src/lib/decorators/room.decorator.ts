import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@invest-be/prisma/prisma.service';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'roomId', async: true })
@Injectable()
export class RoomValidator implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(value: number): Promise<boolean> {
    if (!value || typeof value !== 'number') {
      throw new BadRequestException('roomId must be a number');
    }
    const room = await this.prisma.room.findUnique({ where: { id: value } });
    if (!room) {
      throw new BadRequestException(`Room not found!`);
    }
    return true;
  }
}

export function IsValidRoom(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: RoomValidator,
      async: true,
    });
  };
}
