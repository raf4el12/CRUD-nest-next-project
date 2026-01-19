import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import {
  CreateRefreshTokenInput,
  RefreshTokenRecord,
  RefreshTokenRepository,
} from '../../domain/repositories/refresh-token.repository';

@Injectable()
export class PrismaRefreshTokenRepository implements RefreshTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateRefreshTokenInput): Promise<RefreshTokenRecord> {
    const created = await this.prisma.refreshTokens.create({
      data: {
        userId: data.userId,
        jti: data.jti,
        familyId: data.jti,
        tokenHash: data.tokenHash,
        expiresAt: data.expiresAt,
        ip: data.ip ?? null,
        userAgent: data.userAgent ?? null,
      },
    });

    return {
      id: created.id,
      userId: created.userId,
      jti: created.jti,
      tokenHash: created.tokenHash,
      expiresAt: created.expiresAt,
      revokedAt: created.revokedAt ?? null,
    };
  }

  async findByTokenHash(tokenHash: string): Promise<RefreshTokenRecord | null> {
    const found = await this.prisma.refreshTokens.findFirst({
      where: { tokenHash },
    });

    return found
      ? {
          id: found.id,
          userId: found.userId,
          jti: found.jti,
          tokenHash: found.tokenHash,
          expiresAt: found.expiresAt,
          revokedAt: found.revokedAt ?? null,
        }
      : null;
  }

  async revokeById(id: number): Promise<void> {
    await this.prisma.refreshTokens.update({
      where: { id },
      data: { revokedAt: new Date() },
    });
  }
}
