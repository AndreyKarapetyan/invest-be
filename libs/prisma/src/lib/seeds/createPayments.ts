import { PaymentStatus } from '@prisma/client';
import { prisma, randomIntBetweenWithStep } from '../seed';

export async function createPayments() {
  console.log('Started creating payments...\n');
  const students = await prisma.student.findMany({
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
  for (const student of students) {
    const {
      id: studentId,
      name: studentName,
      lastname: studentLastname,
      actualFee,
      branchName,
      group: { name: groupName, teacher: { user: { name: teacherName, lastname: teacherLastname } = {} } = {} } = {},
    } = student;
    const studentInfo = {
      studentId,
      studentName,
      studentLastname,
      branchName,
      groupName,
      teacherName,
      teacherLastname,
      amount: actualFee,
    };
    await prisma.payment.createMany({
      data: [
        {
          ...studentInfo,
          status: [PaymentStatus.Paid, PaymentStatus.Unpaid, PaymentStatus.Waiting][randomIntBetweenWithStep(0, 2, 1)],
        },
        {
          ...studentInfo,
          status: [PaymentStatus.Paid, PaymentStatus.Unpaid, PaymentStatus.Waiting][randomIntBetweenWithStep(0, 2, 1)],
        },
        {
          ...studentInfo,
          status: [PaymentStatus.Paid, PaymentStatus.Unpaid, PaymentStatus.Waiting][randomIntBetweenWithStep(0, 2, 1)],
        },
        {
          ...studentInfo,
          status: [PaymentStatus.Paid, PaymentStatus.Unpaid, PaymentStatus.Waiting][randomIntBetweenWithStep(0, 2, 1)],
        },
        {
          ...studentInfo,
          status: [PaymentStatus.Paid, PaymentStatus.Unpaid, PaymentStatus.Waiting][randomIntBetweenWithStep(0, 2, 1)],
        },
        {
          ...studentInfo,
          status: [PaymentStatus.Paid, PaymentStatus.Unpaid, PaymentStatus.Waiting][randomIntBetweenWithStep(0, 2, 1)],
        },
        {
          ...studentInfo,
          status: [PaymentStatus.Paid, PaymentStatus.Unpaid, PaymentStatus.Waiting][randomIntBetweenWithStep(0, 2, 1)],
        },
        {
          ...studentInfo,
          status: [PaymentStatus.Paid, PaymentStatus.Unpaid, PaymentStatus.Waiting][randomIntBetweenWithStep(0, 2, 1)],
        },
      ],
    });
  }
  console.log('Finished creating payments.\n');
}
