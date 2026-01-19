import { Inject, Injectable } from '@nestjs/common';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { REFRESH_TOKEN_REPOSITORY, RefreshTokenRepository } from '../../domain/repositories/refresh-token.repository';
import { TokenService } from '../../infraestructure/services/token.service';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly tokenService: TokenService,
  ) {}

  async execute(dto: RefreshTokenDto): Promise<{ message: string }> {
    const tokenHash = this.tokenService.hashToken(dto.refreshToken);
    const stored = await this.refreshTokenRepository.findByTokenHash(tokenHash);
    if (stored && !stored.revokedAt) {
      await this.refreshTokenRepository.revokeById(stored.id);
    }

    return { message: 'Logged out' };
  }
}
