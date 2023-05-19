import { AuthPayLoadOutput, LoginOutput } from '@invest-be/common/types/Auth';
import { compare } from 'bcrypt';
import { Injectable, NotAcceptableException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '@invest-be/common/dto/login.dto';
import { PrismaService } from '@invest-be/prisma/prisma.service';
import { TokenDto } from '@invest-be/common/dto/token.dto';

@Injectable()
export class AuthService {
  private saltOrRounds = 10;

  constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService) {}

  public async login(data: LoginDto): Promise<LoginOutput> {
    const { email, password } = data;
    const user = await this.prisma.user.findFirst({ where: { email } });
    if (!user) {
      throw new NotAcceptableException();
    }
    const validPass = await this.validatePassword(password, user.password);
    if (!validPass) {
      throw new NotAcceptableException();
    }
    const tokens = this.generateToken({ id: user.id.toString() });
    return { ...tokens, role: user.role };
  }

  public async refreshToken(tokenData: TokenDto): Promise<AuthPayLoadOutput> {
    const { refreshToken } = tokenData;
    try {
      const { id } = this.jwtService.verify(refreshToken);
      return this.generateToken({ id });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  private generateToken(payload: { id: string }): AuthPayLoadOutput {
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_REFRESH_IN,
    });
    return { accessToken, refreshToken };
  }

  private async validatePassword(password: string, userPassword: string): Promise<boolean> {
    return compare(password, userPassword);
  }
}
