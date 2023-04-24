import { prisma, randomIntBetweenWithStep } from '../seed';

export async function createBranches() {
  console.log('Started creating branches...\n');
  for (const branchName of ['Artashat', 'Ashtarak', 'Abovyan']) {
    const numOfRooms = randomIntBetweenWithStep(5, 25, 1);
    await prisma.branch.create({
      data: {
        name: branchName,
        room: {
          createMany: {
            data: Array.from(new Array(numOfRooms)).map((_, i) => ({ name: `Room ${i}` })),
          },
        },
      },
    });
  }
  console.log('Finished creating branches.\n');
}
