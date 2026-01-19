import { UserRole } from '@prisma/client';
import { Profile } from './profile.entity.js';
import { Customer } from './customer.entity.js';

export class User {
  constructor(
    public readonly id: number,
    public readonly email: string,
    public readonly role: UserRole,
    public readonly emailVerified: boolean,
    public readonly deletedAt: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly profile?: Profile | null,
    public readonly customer?: Customer | null,
  ) {}
}
