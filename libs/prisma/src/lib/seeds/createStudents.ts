import { StudentStatus } from '@prisma/client';
import { prisma, randomIntBetweenWithStep } from '../seed';

export async function createStudents() {
  console.log('Started creating students...\n');
  const branches = await prisma.branch.findMany();
  for (const { name: branchName } of branches) {
    for (let i = 1; i <= 50; i++) {
      const actualFee = randomIntBetweenWithStep(15000, 30000, 1000);
      await prisma.student.create({
        data: {
          actualFee,
          formalFee: randomIntBetweenWithStep(actualFee, 30000, 5000),
          name: `Student ${i}`,
          lastname: `${branchName}`,
          branchName,
          status: [StudentStatus.Pending, StudentStatus.Registered][
            randomIntBetweenWithStep(0, 1, 1)
          ],
          email: `cool.student${i}@gmail.com`,
        },
      });
    }
  }
  console.log('Finished creating students.\n');
}
