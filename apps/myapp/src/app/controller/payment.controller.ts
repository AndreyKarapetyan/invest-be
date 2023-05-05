import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@invest-be/auth/guards/jwt-auth.guard';
import { ListDto } from '@invest-be/common/dto/list.dto';
import { Payment, Role } from '@prisma/client';
import { PaymentDto } from '@invest-be/common/dto/payment.dto';
import { PaymentService } from '@invest-be/payment/payment.service';
import { PaymentUpdateDto } from '@invest-be/common/dto/payment-update.dto';
import { Roles } from '@invest-be/auth/decorators/role.decorator';
import { RolesGuard } from '@invest-be/auth/guards/role.guard';

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SuperAdmin)
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  async getPayments(@Query() filters: ListDto): Promise<Payment[]> {
    return this.paymentService.getPayments(filters);
  }

  @Post()
  async createPayment(@Body() payment: PaymentDto): Promise<void> {
    return this.paymentService.createPayment(payment);
  }

  @Put('/:paymentId')
  async updatePayment(
    @Param('paymentId', ParseIntPipe) paymentId: number,
    @Body() paymentData: PaymentUpdateDto,
  ): Promise<void> {
    return this.paymentService.updatePayment(paymentId, paymentData);
  }

  @Delete('/:paymentId')
  async deletePayment(@Param('paymentId') paymentId: number): Promise<void> {
    return this.paymentService.deletePayment(paymentId);
  }
}
