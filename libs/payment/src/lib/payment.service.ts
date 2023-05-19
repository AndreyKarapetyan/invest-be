import moment from 'moment';
import { Injectable } from '@nestjs/common';
import { ListDto } from '@invest-be/common/dto/list.dto';
import { PaginatedResponse } from '@invest-be/common/types/PaginatedResponse';
import { Payment } from '@prisma/client';
import { PaymentDto } from '@invest-be/common/dto/payment.dto';
import { PaymentSuperAdmin } from '@invest-be/common/types/payment/payment-superadmin';
import { PaymentUpdateDto } from '@invest-be/common/dto/payment-update.dto';
import { PrismaService } from '@invest-be/prisma/prisma.service';

@Injectable()
export class PaymentService {
  constructor(private readonly prisma: PrismaService) {}

  async getPayments(filters: ListDto): Promise<Promise<PaginatedResponse<PaymentSuperAdmin>>> {
    const {
      branch: { branchName },
      pagination: { skip, take },
      search: searchStr,
    } = filters;
    const search = searchStr
      .trim()
      .split(' ')
      .filter((s) => s)
      .join(' ')
      .toLowerCase();
    const rawCount = await this.prisma.$queryRaw<{ count: number }[]>`
      SELECT COUNT(DISTINCT(id)) as count FROM Payment
      WHERE
        deletedAt IS NULL AND
        branchName = ${branchName} AND
        (
          id LIKE ${'%' + search + '%'} OR
          amount LIKE ${'%' + search + '%'} OR
          status LIKE ${'%' + search + '%'} OR
          CONCAT(studentName, ' ', studentLastname) LIKE ${'%' + search + '%'} OR
          groupName LIKE ${'%' + search + '%'} OR
          teacherName LIKE ${'%' + search + '%'} OR
          teacherLastname LIKE ${'%' + search + '%'}
        )
    `;
    const payments = await this.prisma.$queryRaw<Payment[]>`
      SELECT * FROM Payment
      WHERE
        deletedAt IS NULL AND
        branchName = ${branchName} AND
        (
          id LIKE ${'%' + search + '%'} OR
          amount LIKE ${'%' + search + '%'} OR
          status LIKE ${'%' + search + '%'} OR
          CONCAT(studentName, ' ', studentLastname) LIKE ${'%' + search + '%'} OR
          groupName LIKE ${'%' + search + '%'} OR
          teacherName LIKE ${'%' + search + '%'} OR
          teacherLastname LIKE ${'%' + search + '%'}
        )  
        ORDER BY createdAt DESC, updatedAt DESC 
        LIMIT ${take} OFFSET ${skip}
    `;
    const count = Number(rawCount[0]?.count);
    const result: PaginatedResponse<PaymentSuperAdmin> = {
      take,
      skip,
      count,
      data: payments.map(
        ({
          amount,
          createdAt,
          groupName,
          id,
          status,
          studentId,
          studentLastname,
          studentName,
          teacherLastname,
          teacherName,
        }) => ({
          amount,
          createdAt: moment(createdAt).format('YYYY-MM-DD'),
          groupName,
          id,
          status,
          studentId,
          studentLastname,
          studentName,
          teacherLastname,
          teacherName,
        }),
      ),
    };
    return result;
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
