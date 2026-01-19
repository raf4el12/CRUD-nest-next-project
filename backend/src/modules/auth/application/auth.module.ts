import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../../users/application/users.module';
import { AuthController } from '../interfaces/controllers/auth.controller';
import { RegisterUseCase } from './use-cases/register.use-case';
import { LoginUseCase } from './use-cases/login.use-case';
import { RefreshTokenUseCase } from './use-cases/refresh-token.use-case';
import { LogoutUseCase } from './use-cases/logout.use-case';
import { MeUseCase } from './use-cases/me.use-case';
import { PasswordService } from '../infraestructure/services/password.service';
import { TokenService } from '../infraestructure/services/token.service';
import { REFRESH_TOKEN_REPOSITORY } from '../domain/repositories/refresh-token.repository';
import { PrismaRefreshTokenRepository } from '../infraestructure/persistence/prisma-refresh-token.repository';
import { JwtAuthGuard } from '../interfaces/guards/jwt-auth.guard';
import {
  ACCESS_TOKEN_MINUTE_SIGN_NOMINAL,
  ACCESS_TOKEN_SECRET,
} from '../../../shared/constants/shared.constants';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: ACCESS_TOKEN_SECRET,
      signOptions: {
        expiresIn: Math.floor(ACCESS_TOKEN_MINUTE_SIGN_NOMINAL / 1000),
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    RegisterUseCase,
    LoginUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,
    MeUseCase,
    PasswordService,
    TokenService,
    JwtAuthGuard,
    {
      provide: REFRESH_TOKEN_REPOSITORY,
      useClass: PrismaRefreshTokenRepository,
    },
  ],
})
export class AuthModule {}
