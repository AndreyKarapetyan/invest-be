import { ApiTags } from '@nestjs/swagger';
import { AuthPayLoadOutput, LoginOutput } from '@invest-be/common/types/Auth';
import { AuthService } from '@invest-be/auth/services/auth.service';
import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from '@invest-be/common/dto/login.dto';
import { TokenDto } from '@invest-be/common/dto/token.dto';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() data: LoginDto): Promise<LoginOutput> {
    return this.authService.login(data);
  }

  @Post('refresh-token')
  async refreshToken(@Body() data: TokenDto): Promise<AuthPayLoadOutput> {
    return this.authService.refreshToken(data);
  }
}
