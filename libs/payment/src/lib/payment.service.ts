import { Injectable } from '@nestjs/common';
import { ListDto } from '@invest-be/common/dto/list.dto';
import { Payment } from '@prisma/client';
import { PaymentDto } from '@invest-be/common/dto/payment.dto';
import { PaymentUpdateDto } from '@invest-be/common/dto/payment-update.dto';
import { PrismaService } from '@invest-be/prisma/prisma.service';

@Injectable()
export class PaymentService {
  constructor(private readonly prisma: PrismaService) {}

  async getPayments(filters: ListDto): Promise<Payment[]> {
    const {
      branch: { branchName },
      pagination: { skip, take },
      search,
    } = filters;
    const payments = await this.prisma.$queryRaw<Payment[]>`
      SELECT * FROM Payment
      WHERE
        deletedAt IS NULL AND
        branchName = ${branchName} AND
        (
          id LIKE ${'%' + search + '%'} OR
          amount LIKE ${'%' + search + '%'} OR
          status LIKE ${'%' + search + '%'} OR
          studentName LIKE ${'%' + search + '%'} OR
          studentLastname LIKE ${'%' + search + '%'} OR
          groupName LIKE ${'%' + search + '%'} OR
          teacherName LIKE ${'%' + search + '%'} OR
          teacherLastname LIKE ${'%' + search + '%'}
        )  
        ORDER BY updatedAt DESC, createdAt DESC 
        LIMIT ${take} OFFSET ${skip}
    `;
    return payments;
  }

  async createPayment(payment: PaymentDto): Promise<void> {
    const { amount, studentId, status } = payment;
    const student = await this.prisma.student.findFirst({
      where: {
        id: studentId,
      },
      include: {
        group: {
          include: {
            teacher: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });
    const {
      name: studentName,
      lastname: studentLastname,
      branchName,
      group: { name: groupName, teacher: { user: { name: teacherName, lastname: teacherLastname } = {} } = {} } = {},
    } = student;
    await this.prisma.payment.create({
      data: {
        amount,
        studentId,
        studentName,
        studentLastname,
        branchName,
        groupName,
        teacherName,
        teacherLastname,
        status,
      },
    });
  }

  async updatePayment(paymentId: number, payment: PaymentUpdateDto): Promise<void> {
    const { status } = payment;
    await this.prisma.payment.update({
      data: {
        status,
        updatedAt: new Date(),
      },
      where: {
        id: paymentId,
      },
    });
  }

  async deletePayment(paymentId: number): Promise<void> {
    await this.prisma.payment.update({
      where: {
        id: paymentId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
