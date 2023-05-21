import { StudentStatus } from '@prisma/client';
import { prisma, randomIntBetweenWithStep, shuffleArray } from '../seed';

const students = [
  { name: 'Arman', lastname: 'Sargsyan' },
  { name: 'Gevorg', lastname: 'Ghazaryan' },
  { name: 'Anahit', lastname: 'Mkrtchyan' },
  { name: 'Gohar', lastname: 'Hakobyan' },
  { name: 'Naira', lastname: 'Harutyunyan' },
  { name: 'Hripsime', lastname: 'Avetisyan' },
  { name: 'Satenik', lastname: 'Karapetyan' },
  { name: 'Astghik', lastname: 'Yeghiazaryan' },
  { name: 'Armine', lastname: 'Sahakyan' },
  { name: 'Mariam', lastname: 'Grigoryan' },
  { name: 'Lilit', lastname: 'Petrosyan' },
  { name: 'Arpi', lastname: 'Vardanyan' },
  { name: 'Gayane', lastname: 'Poghosyan' },
  { name: 'Siranush', lastname: 'Asatryan' },
  { name: 'Nune', lastname: 'Danielyan' },
  { name: 'Shushan', lastname: 'Galstyan' },
  { name: 'Ani', lastname: 'Khachatryan' },
  { name: 'Elen', lastname: 'Martirosyan' },
  { name: 'Varduhi', lastname: 'Simonyan' },
  { name: 'Marine', lastname: 'Babayan' },
  { name: 'Anush', lastname: 'Stepanyan' },
  { name: 'Taguhi', lastname: 'Manukyan' },
  { name: 'Lusine', lastname: 'Gevorgyan' },
  { name: 'Karine', lastname: 'Tamrazyan' },
  { name: 'Hasmik', lastname: 'Harutyunyan' },
  { name: 'Gayane', lastname: 'Sargsyan' },
  { name: 'Kristine', lastname: 'Khachaturyan' },
  { name: 'Anna', lastname: 'Mkrtchyan' },
  { name: 'Ruzanna', lastname: 'Grigoryan' },
  { name: 'Susanna', lastname: 'Ghazaryan' },
  { name: 'Armenuhi', lastname: 'Avagyan' },
  { name: 'Nare', lastname: 'Asatryan' },
  { name: 'Sirusho', lastname: 'Karapetyan' },
  { name: 'Sona', lastname: 'Poghosyan' },
  { name: 'Tatevik', lastname: 'Yeghiazaryan' },
  { name: 'Alina', lastname: 'Hovsepyan' },
  { name: 'Heghine', lastname: 'Mirzoyan' },
  { name: 'Lusaber', lastname: 'Sahakyan' },
  { name: 'Knarik', lastname: 'Davtyan' },
  { name: 'Mane', lastname: 'Hovhannisyan' },
  { name: 'Syuzanna', lastname: 'Stepanyan' },
  { name: 'Haykuhi', lastname: 'Zakaryan' },
  { name: 'Maral', lastname: 'Minasyan' },
  { name: 'Narine', lastname: 'Avetisyan' },
  { name: 'Anahit', lastname: 'Karapetyan' },
  { name: 'Tamar', lastname: 'Gasparyan' },
  { name: 'Arevik', lastname: 'Martirosyan' },
  { name: 'Nelly', lastname: 'Petrosyan' },
  { name: 'Araks', lastname: 'Asatryan' },
  { name: 'Karo', lastname: 'Danielyan' }
];

export async function createStudents() {
  console.log('Started creating students...\n');
  const branches = await prisma.branch.findMany();
  for (const { name: branchName } of branches) {
    const fees = Array.from(new Array(50), () => randomIntBetweenWithStep(15000, 30000, 1000));
    await prisma.student.createMany({
      data: shuffleArray(students).map(({ name, lastname }, i) => ({
        name,
        lastname,
        branchName,
        actualFee: fees[i],
        formalFee: fees[i],
        status: [StudentStatus.Pending, StudentStatus.Registered][randomIntBetweenWithStep(0, 1, 1)],
        email: `${name}.${lastname}@gmail.com`.toLowerCase(),
      })),
    });
  }
  console.log('Finished creating students.\n');
}
