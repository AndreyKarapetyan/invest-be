import { PrismaModule } from '@invest-be/prisma/prisma.module';
import { Module } from "@nestjs/common";
import { PaymentService } from './payment.service';
import { CommonModule } from '@invest-be/common/common.module';

@Module({
  imports: [PrismaModule, CommonModule],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
