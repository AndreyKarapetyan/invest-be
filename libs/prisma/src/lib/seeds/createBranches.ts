import { prisma } from '../seed';

export async function createBranches() {
  console.log('Started creating branches...\n');
  await prisma.branch.createMany({
    data: [
      {
        name: 'Artashat',
      },
      {
        name: 'Ashtarak',
      },
      {
        name: 'Abovyan',
      },
    ],
  });
  console.log('Finished creating branches.\n');
}
