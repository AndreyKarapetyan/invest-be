import { createBranches } from './seeds/createBranches';
import { createPayments } from './seeds/createPayments';
import { createStudents } from './seeds/createStudents';
import { createSuperAdmin } from './seeds/createSuperAdmin';
import { createTeachers } from './seeds/createTeachers';
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export const randomIntBetweenWithStep = (min: number, max: number, step: number): number => {
  const range = (max - min) / step + 1;
  const randomIndex = Math.floor(Math.random() * range);
  return min + step * randomIndex;
};

export const shuffleArray = <T>(arr: T[]): T[] => arr.sort(() => Math.random() - 0.5);

async function main(): Promise<void> {
  await createBranches();
  await createSuperAdmin();
  await createStudents();
  await createTeachers();
  await createPayments();
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
