import { Role } from '@prisma/client';

export interface AuthPayLoadOutput {
  accessToken: string;
  refreshToken: string;
}

export interface LoginOutput {
  accessToken: string;
  refreshToken: string;
  role: Role;
}
