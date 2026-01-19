import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { REFRESH_TOKEN_REPOSITORY, RefreshTokenRepository } from '../../domain/repositories/refresh-token.repository';
import { TokenService } from '../../infraestructure/services/token.service';
import { USER_REPOSITORY, UserRepository } from '../../../users/domain/repositories/user.repository';

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: RefreshTokenRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
  ) {}

  async execute(dto: RefreshTokenDto): Promise<RefreshResponse> {
    const tokenHash = this.tokenService.hashToken(dto.refreshToken);
    const stored = await this.refreshTokenRepository.findByTokenHash(tokenHash);

    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userRepository.findById(stored.userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const accessToken = this.tokenService.generateAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      accessToken,
      refreshToken: dto.refreshToken,
    };
  }
}
