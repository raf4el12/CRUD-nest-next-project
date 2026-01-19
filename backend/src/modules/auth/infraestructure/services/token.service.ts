import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@prisma/client';
import { createHash, randomUUID } from 'crypto';

export interface AccessTokenPayload {
  sub: number;
  email: string;
  role: UserRole;
}

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken(payload: AccessTokenPayload): string {
    return this.jwtService.sign(payload);
  }

  generateRefreshToken(): { token: string; tokenHash: string; jti: string } {
    const jti = randomUUID();
    const token = jti;
    const tokenHash = createHash('sha256').update(token).digest('hex');
    return { token, tokenHash, jti };
  }

  hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
