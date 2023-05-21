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
  await prisma.payment.createMany({
    data: students
      .map(
        ({
          id: studentId,
          name: studentName,
          lastname: studentLastname,
          actualFee,
          branchName,
          group: {
            name: groupName,
            teacher: { user: { name: teacherName, lastname: teacherLastname } = {} } = {},
          } = {},
        }) => ({
          studentId,
          studentName,
          studentLastname,
          branchName,
          groupName,
          teacherName,
          teacherLastname,
          amount: actualFee,
        }),
      )
      .flatMap((payment) =>
        Array.from(new Array(randomIntBetweenWithStep(5, 8, 1))).fill({
          ...payment,
          status: [PaymentStatus.Paid, PaymentStatus.Unpaid, PaymentStatus.Waiting][randomIntBetweenWithStep(0, 2, 1)],
        }),
      ),
  });
  console.log('Finished creating payments.\n');
}
