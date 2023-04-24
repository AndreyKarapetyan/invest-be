import moment from 'moment';
import { ChangeMode } from '@invest-be/common/types/lesson/changeMode';
import { Injectable } from '@nestjs/common';
import { LessonDeletionDto } from '@invest-be/common/dto/lesson-deletion.dto';
import { LessonDto } from '@invest-be/common/dto/lesson.dto';
import { LessonGetDto } from '@invest-be/common/dto/lesson-get.dto';
import { LessonUpdateDto } from '@invest-be/common/dto/lesson-update.dto';
import { PrismaService } from '@invest-be/prisma/prisma.service';
import { RetrievedLesson } from '@invest-be/common/types/lesson/retrieved-lesson';

@Injectable()
export class LessonService {
  constructor(private readonly prisma: PrismaService) {}
  // @TODO: Validation
  async createLesson(lessonData: LessonDto) {
    const { date, startHour, startMinute, endHour, endMinute, pattern, groupId, roomId } =
      lessonData;
    const modifiedData = moment(date).format();
    await this.prisma.lesson.create({
      data: {
        date: modifiedData,
        startHour,
        startMinute,
        endHour,
        endMinute,
        pattern,
        group: {
          connect: {
            id: groupId,
          },
        },
        room: {
          connect: {
            id: roomId,
          },
        },
      },
    });
  }

  async getLessons(params: LessonGetDto) {
    const { branchName, date } = params;
    const modifiedDate = moment(date).format('YYYY-MM-DD');
    const rawResult = await this.prisma.$queryRaw<RetrievedLesson[]>`
      SELECT 
        l.id as lessonId, 
        l.*,
        g.name as groupName,
        g.*,
        u.*
      FROM Lesson l
      INNER JOIN Room r ON l.roomId = r.id
      INNER JOIN \`Group\` g ON g.id = l.groupId
      INNER JOIN Teacher t ON g.teacherId = t.id
      INNER JOIN User u ON t.id = u.id
      LEFT JOIN CancelledLesson cl ON l.id = cl.lessonId
      WHERE
        r.branchName = ${branchName} AND
        (
          (FIND_IN_SET(DAYOFWEEK(${modifiedDate}), l.pattern) > 0 AND l.date <= ${modifiedDate}) OR 
          (l.pattern = 'once' AND l.date = ${modifiedDate})
        ) AND
        l.id NOT IN (
          SELECT l2.id FROM Lesson l2
          LEFT JOIN CancelledLesson cl2 ON l2.id = cl2.lessonId
          WHERE
            (
              (cl2.isOnce = 1 AND cl2.date = ${modifiedDate}) OR 
              (cl2.isOnce = 0 AND cl2.date <= ${modifiedDate})
            )
        )
    `;
    const lessonUniqueIds = new Set();
    const result = rawResult
      .filter(({ lessonId }) => {
        if (lessonUniqueIds.has(lessonId)) {
          return false;
        }
        lessonUniqueIds.add(lessonId);
        return true;
      })
      .map(
        ({
          lessonId,
          startHour,
          startMinute,
          endHour,
          endMinute,
          pattern,
          groupId,
          groupName,
          teacherId,
          roomId,
          name,
          lastname,
        }) => ({
          id: lessonId,
          start: {
            hour: startHour,
            minute: startMinute,
          },
          end: {
            hour: endHour,
            minute: endMinute,
          },
          pattern,
          groupId,
          groupName,
          teacherId,
          roomId,
          teacherFullName: `${name} ${lastname}`,
        }),
      );
    return result;
  }

  async updateLesson(lessonData: LessonUpdateDto): Promise<void> {
    const {
      id,
      changeMode,
      date,
      endHour,
      endMinute,
      groupId,
      pattern,
      startHour,
      startMinute,
    } = lessonData;
    const lesson = await this.prisma.lesson.findUnique({
      where: {
        id,
      },
      include: {
        cancelledLesson: true,
      },
    });
    const isSame =
      pattern === lesson.pattern &&
      startHour === lesson.startHour &&
      startMinute === lesson.startMinute &&
      endHour === lesson.endHour &&
      endMinute === lesson.endMinute &&
      groupId === lesson.groupId;
    if (isSame) {
      return;
    }
    if (changeMode === ChangeMode.ALL) {
      await this.prisma.lesson.update({
        where: {
          id,
        },
        data: {
          pattern,
          startHour,
          startMinute,
          endHour,
          endMinute,
          group: {
            connect: {
              id: groupId,
            },
          },
        },
      });
    } else {
      const modifiedData = moment(date).format();
      const cancelLessons = this.prisma.cancelledLesson.create({
        data: {
          date: modifiedData,
          isOnce: changeMode === ChangeMode.ONCE,
          lesson: {
            connect: {
              id,
            },
          },
        },
      });
      const createNewLesson = this.prisma.lesson.create({
        data: {
          date: modifiedData,
          startHour,
          startMinute,
          endHour,
          endMinute,
          pattern,
          group: {
            connect: {
              id: groupId,
            },
          },
          room: {
            connect: {
              id: lesson.roomId,
            },
          },
          cancelledLesson: {
            createMany: {
              data: lesson.cancelledLesson.map(({ date, isOnce }) => ({ date, isOnce })),
            },
          },
        },
      });
      await this.prisma.$transaction([cancelLessons, createNewLesson]);
    }
  }

  async deleteLesson(details: LessonDeletionDto): Promise<void> {
    const { id, changeMode, date } = details;
    const modifiedData = moment(date).format();
    if (changeMode === ChangeMode.ALL) {
      await this.prisma.lesson.delete({
        where: {
          id,
        },
      });
    } else {
      await this.prisma.cancelledLesson.create({
        data: {
          lesson: {
            connect: {
              id,
            },
          },
          isOnce: changeMode === ChangeMode.ONCE,
          date: modifiedData,
        },
      });
    }
  }
}
