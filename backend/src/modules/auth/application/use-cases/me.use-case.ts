import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY, UserRepository } from '../../../users/domain/repositories/user.repository';
import { User } from '../../../users/domain/entities/user.entity';

@Injectable()
export class MeUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  execute(userId: number): Promise<User | null> {
    return this.userRepository.findByIdWithRelations(userId);
  }
}
