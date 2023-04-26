import { Role } from '@prisma/client';
import { prisma } from '../seed';
import { hashSync } from 'bcrypt';

export async function createSuperAdmin() {
  console.log('Started creating SuperAdmin...\n');
  const branches = await prisma.branch.findMany();
  await prisma.user.create({
    data: {
      email: process.env.SA_EMAIL,
      password: hashSync(process.env.SA_PASSWORD, 10),
      role: Role.SuperAdmin,
      name: 'Andrey',
      lastname: 'Karapetyan',
      branch: {
        connect: branches.map(({ name }) => ({ name })),
      },
    },
  });
  console.log('Finished creating SuperAdmin.\n');
}
