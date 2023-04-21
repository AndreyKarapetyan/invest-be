import { prisma, randomIntBetweenWithStep } from '../seed';

export async function createBranches() {
  console.log('Started creating branches...\n');
  for (const branchName of ['Artashat', 'Ashtarak', 'Abovyan']) {
    await prisma.branch.create({
      data: {
        name: branchName,
        room: {
          createMany: {
            data: [
              {
                name: `Room ${randomIntBetweenWithStep(1, 5, 1)}`,
              },
              {
                name: `Room ${randomIntBetweenWithStep(1, 5, 1)}`,
              },
              {
                name: `Room ${randomIntBetweenWithStep(1, 5, 1)}`,
              },
              {
                name: `Room ${randomIntBetweenWithStep(1, 5, 1)}`,
              },
              {
                name: `Room ${randomIntBetweenWithStep(1, 5, 1)}`,
              },
            ],
          },
        },
      },
    });
  }
  console.log('Finished creating branches.\n');
}
