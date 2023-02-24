import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('a')
  async getA() {
    // await new Promise((res) => setTimeout(() => res(true), 5000))
    return this.appService.getData();
  }

  @Get('b')
  getB() {
    return 'b';
  }
}
