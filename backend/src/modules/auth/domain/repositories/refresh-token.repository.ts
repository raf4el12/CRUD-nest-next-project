export const REFRESH_TOKEN_REPOSITORY = 'RefreshTokenRepository';

export interface CreateRefreshTokenInput {
  userId: number;
  jti: string;
  tokenHash: string;
  expiresAt: Date;
  ip?: string | null;
  userAgent?: string | null;
}

export interface RefreshTokenRecord {
  id: number;
  userId: number;
  jti: string;
  tokenHash: string;
  expiresAt: Date;
  revokedAt: Date | null;
}

export interface RefreshTokenRepository {
  create(data: CreateRefreshTokenInput): Promise<RefreshTokenRecord>;
  findByTokenHash(tokenHash: string): Promise<RefreshTokenRecord | null>;
  revokeById(id: number): Promise<void>;
}
