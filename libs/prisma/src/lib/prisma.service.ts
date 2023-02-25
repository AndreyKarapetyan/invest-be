import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {

  constructor() {
    super({
      log: process.env.PRISMA_LOGS_ENABLED === 'true' ? [
        {
          level: 'info',
          emit: 'event',
        },
        {
          level: 'query',
          emit: 'event',
        },
        {
          level: 'warn',
          emit: 'event',
        },
        {
          level: 'error',
          emit: 'event',
        }
      ] : []
    });
    this.setupLogSubscription('info');
    this.setupLogSubscription('query');
    this.setupLogSubscription('warn');
    this.setupLogSubscription('error');
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  private setupLogSubscription(level: string) {
    this.$on((level as any), (e) => {
      if (level === 'query') {
        console.log({
          query: (e as any).query,
          params: (e as any).params
        })
      } else {
        console.log(e)
      }
    });
  }
}
