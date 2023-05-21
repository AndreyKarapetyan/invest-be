import { Level, Role } from '@prisma/client';
import { prisma, randomIntBetweenWithStep } from '../seed';

const teachers = [
  { name: 'Luiza', lastname: 'Voskanyan' },
  { name: 'Shoghakat', lastname: 'Sargsyan' },
  { name: 'Tsaghik', lastname: 'Abrahamyan' },
  { name: 'Lilit', lastname: 'Ter-Petrosyan' },
  { name: 'Gohar', lastname: 'Levonyan' },
  { name: 'Liana', lastname: 'Torosyan' },
  { name: 'Araksi', lastname: 'Yeghiazaryan' },
  { name: 'Gayane', lastname: 'Davtyan' },
  { name: 'Hasmik', lastname: 'Kocharyan' },
  { name: 'Arevik', lastname: 'Azizyan' },
  { name: 'Heghine', lastname: 'Nazaryan' },
  { name: 'Arusyak', lastname: 'Gabrielyan' },
  { name: 'Vergine', lastname: 'Gevorgyan' },
  { name: 'Srbuhi', lastname: 'Gasparyan' },
  { name: 'Saten', lastname: 'Tadevosyan' },
];
const phonePrefixes = ['093', '094', '095', '096', '097', '098', '099', '055', '033', '044', '077'];
const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz';
const upperCaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const groupNames = ['Individual', 'Starter', 'Intermediate', 'Upper Intermediate', 'Elementary', 'Pre-TOEFL'];

export async function createTeachers() {
  console.log('Started creating teachers...\n');
  const branches = await prisma.branch.findMany();
  await Promise.all(
    branches.map(async ({ name: branchName }, i) => {
      const students = await prisma.student.findMany({
        where: {
          branchName,
        },
        orderBy: {
          id: 'asc',
        },
      });
      const branchTeachers = teachers.slice(i * 5, (i + 1) * 5);
      await Promise.all(
        branchTeachers.map(async ({ name, lastname }, j) => {
          const teacherStudentIds = students.slice(j * 10, (j + 1) * 10).map((s) => ({ id: s.id }));
          const { id: teacherId } = await prisma.teacher.create({
            data: {
              phoneNumber: `${phonePrefixes[randomIntBetweenWithStep(0, 10, 1)]}${Array.from(new Array(6), () =>
                randomIntBetweenWithStep(0, 9, 1),
              ).join('')}`,
              level: [Level.B1, Level.B1Plus, Level.B2, Level.B2Plus, Level.C1][randomIntBetweenWithStep(0, 4, 1)],
              salaryPercent: [40, 45, 50][randomIntBetweenWithStep(0, 2, 1)],
              user: {
                create: {
                  name,
                  lastname,
                  email: `${name}.${lastname}${randomIntBetweenWithStep(1990, 2001, 1)}@gmail.com`.toLowerCase(),
                  password: `${lowerCaseLetters[randomIntBetweenWithStep(0, 25, 1)]}${
                    upperCaseLetters[randomIntBetweenWithStep(0, 25, 1)]
                  }${randomIntBetweenWithStep(0, 9, 1)}${Array.from(
                    new Array(3),
                    () => lowerCaseLetters[randomIntBetweenWithStep(0, 25, 1)],
                  ).join('')}${Array.from(
                    new Array(3),
                    () => upperCaseLetters[randomIntBetweenWithStep(0, 25, 1)],
                  ).join('')}${randomIntBetweenWithStep(0, 9, 1)}`,
                  role: Role.Teacher,
                  branch: {
                    connect: {
                      name: branchName,
                    },
                  },
                },
              },
            },
          });
          await prisma.group.create({
            data: {
              name: groupNames[0],
              teacher: {
                connect: {
                  id: teacherId,
                },
              },
              student: {
                connect: {
                  id: teacherStudentIds[0].id,
                },
              },
            },
          });
          const remainingTeacherStudentIds = teacherStudentIds.slice(1);
          const remainingGroups = groupNames.slice(1);
          const numOfGrous = randomIntBetweenWithStep(2, 3, 1);
          if (numOfGrous === 2) {
            await prisma.group.create({
              data: {
                name: remainingGroups[0],
                teacher: {
                  connect: {
                    id: teacherId,
                  },
                },
                student: {
                  connect: remainingTeacherStudentIds.slice(0, 5),
                },
              },
            });
            await prisma.group.create({
              data: {
                name: remainingGroups[1],
                teacher: {
                  connect: {
                    id: teacherId,
                  },
                },
                student: {
                  connect: remainingTeacherStudentIds.slice(5, 10),
                },
              },
            });
          } else if (numOfGrous === 3) {
            await prisma.group.create({
              data: {
                name: remainingGroups[2],
                teacher: {
                  connect: {
                    id: teacherId,
                  },
                },
                student: {
                  connect: remainingTeacherStudentIds.slice(0, 3),
                },
              },
            });
            await prisma.group.create({
              data: {
                name: remainingGroups[3],
                teacher: {
                  connect: {
                    id: teacherId,
                  },
                },
                student: {
                  connect: remainingTeacherStudentIds.slice(3, 6),
                },
              },
            });
            await prisma.group.create({
              data: {
                name: remainingGroups[4],
                teacher: {
                  connect: {
                    id: teacherId,
                  },
                },
                student: {
                  connect: remainingTeacherStudentIds.slice(6, 10),
                },
              },
            });
          }
          // for (let i = 1; i <= numOfGrous; i++) {
          //   await prisma.group.create({
          //     data: {
          //       name:
          //         numOfGrous === 2
          //           ? groupNames[randomIntBetweenWithStep((i - 1) * numOfGrous, numOfGrous * 2 - 1, 1)]
          //           : groupNames[randomIntBetweenWithStep(i - 1, i, 1)],
          //       teacher: {
          //         connect: {
          //           id: teacherId,
          //         },
          //       },
          //       student: {
          //         connect:
          //           numOfGrous === 2
          //             ? remainingTeacherStudentIds.slice((i - 1) * 5, i * 5)
          //             : remainingTeacherStudentIds.slice((i - 1) * 3, i * 3),
          //       },
          //     },
          //   });
          // }
          // for (let i = 1; i <= 30; i++) {
          //   const teacherStudentIds = students.slice((i - 1) * 10, i * 10 + 1).map((s) => ({ id: s.id }));
          //   await prisma.teacher.create({
          //     data: {
          //       level: [Level.B1, Level.B1Plus, Level.B2, Level.B2Plus, Level.C1][randomIntBetweenWithStep(0, 4, 1)],
          //       phoneNumber: `$09335135${1}`,
          //       salaryPercent: [40, 45, 50][randomIntBetweenWithStep(0, 2, 1)],
          //       user: {
          //         create: {
          //           name: `Teacher ${i}`,
          //           lastname: `${branchName}`,
          //           email: `cool.teacher${i}@gmail.com`,
          //           password: `${randomIntBetweenWithStep(10000000, 99999999, 1)}`,
          //           role: Role.Teacher,
          //           branch: {
          //             connect: {
          //               name: branchName,
          //             },
          //           },
          //         },
          //       },
          //       group: {
          //         createMany: {
          //           data: [{

          //           }]
          //         }
          //       },
          //     },
          //   });
          // }
        }),
      );
    }),
  );
  console.log('Finished creating teachers.\n');
}
