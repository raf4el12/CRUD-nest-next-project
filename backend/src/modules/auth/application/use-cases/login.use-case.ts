import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import {
  USER_REPOSITORY,
  UserRepository,
} from '../../../users/domain/repositories/user.repository';
import { LoginDto } from '../dto/login.dto';
import { PasswordService } from '../../infraestructure/services/password.service';
import { TokenService } from '../../infraestructure/services/token.service';
import {
  REFRESH_TOKEN_REPOSITORY,
  RefreshTokenRepository,
} from '../../domain/repositories/refresh-token.repository';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
  ) {}

  async execute(
    dto: LoginDto,
    ip?: string,
    userAgent?: string,
  ): Promise<LoginResponse> {
    const authUser = await this.userRepository.findAuthByEmail(dto.email);
    if (!authUser) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await this.passwordService.compare(
      dto.password,
      authUser.passwordHash,
    );
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.tokenService.generateAccessToken({
      sub: authUser.id,
      email: authUser.email,
      role: authUser.role,
    });

    const { token, tokenHash, jti } = this.tokenService.generateRefreshToken();

    await this.refreshTokenRepository.create({
      userId: authUser.id,
      jti,
      tokenHash,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      ip: ip ?? null,
      userAgent: userAgent ?? null,
    });

    return { accessToken, refreshToken: token };
  }
}
