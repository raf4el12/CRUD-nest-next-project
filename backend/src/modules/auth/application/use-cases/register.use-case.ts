import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY, UserRepository } from '../../../users/domain/repositories/user.repository';
import { RegisterDto } from '../dto/register.dto';
import { PasswordService } from '../../infraestructure/services/password.service';
import { User } from '../../../users/domain/entities/user.entity';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
  ) {}

  async execute(dto: RegisterDto): Promise<User> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await this.passwordService.hash(dto.password);
    const user = await this.userRepository.createUser({
      email: dto.email,
      passwordHash,
      role: dto.role,
    });

    await this.userRepository.createProfile({
      userId: user.id,
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone ?? null,
    });

    await this.userRepository.createCustomer({
      userId: user.id,
    });

    const fullUser = await this.userRepository.findByIdWithRelations(user.id);
    return fullUser ?? user;
  }
}
