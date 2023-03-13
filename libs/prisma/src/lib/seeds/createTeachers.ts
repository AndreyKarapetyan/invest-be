import { Level, Role } from '@prisma/client';
import { prisma, randomIntBetweenWithStep } from '../seed';

export async function createTeachers() {
  console.log('Started creating teachers...\n');
  const branches = await prisma.branch.findMany();
  for (const { name: branchName } of branches) {
    const students = await prisma.student.findMany({
      where: {
        branchName,
      },
      orderBy: {
        id: 'asc',
      },
    });
    for (let i = 1; i <= 30; i++) {
      const teacherStudentIds = students
        .slice((i - 1) * 10, i * 10 + 1)
        .map((s) => ({ id: s.id }));
      await prisma.teacher.create({
        data: {
          level: [Level.B1, Level.B1Plus, Level.B2, Level.B2Plus, Level.C1][
            randomIntBetweenWithStep(0, 4, 1)
          ],
          phoneNumber: `$09335135${1}`,
          salaryPercent: [40, 45, 50][randomIntBetweenWithStep(0, 2, 1)],
          user: {
            create: {
              name: `Teacher ${i}`,
              lastname: `${branchName}`,
              email: `cool.teacher${i}@gmail.com`,
              password: `${randomIntBetweenWithStep(10000000, 99999999, 1)}`,
              role: Role.Teacher,
              branch: {
                connect: {
                  name: branchName,
                },
              },
            },
          },
          group: {
            create: {
              name: `Primary Group of Teacher ${i}`,
              student: {
                connect: teacherStudentIds,
              },
            },
          },
        },
      });
    }
  }
  console.log('Finished creating teachers.\n');
}
