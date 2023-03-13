import { createBranches } from './seeds/createBranches';
import { createStudents } from './seeds/createStudents';
import { createTeachers } from './seeds/createTeachers';
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export function randomIntBetweenWithStep(min: number, max: number, step: number): number {
  const range = (max - min) / step + 1;
  const randomIndex = Math.floor(Math.random() * range);
  return min + step * randomIndex;
}

async function main(): Promise<void> {
  await createBranches();
  await createStudents();
  await createTeachers();
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
