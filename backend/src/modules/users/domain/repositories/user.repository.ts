import { UserRole } from '@prisma/client';
import { User } from '../entities/user.entity';
import { Profile } from '../entities/profile.entity';
import { Customer } from '../entities/customer.entity';

export const USER_REPOSITORY = 'UserRepository';

export interface CreateUserInput {
  email: string;
  passwordHash: string;
  role?: UserRole;
}

export interface CreateProfileInput {
  userId: number;
  firstName: string;
  lastName: string;
  phone?: string | null;
  photo?: string | null;
  documentType?: string | null;
  documentNumber?: string | null;
}

export interface CreateCustomerInput {
  userId: number;
  shippingAddress?: string | null;
  billingAddress?: string | null;
}

export interface UserRepository {
  createUser(data: CreateUserInput): Promise<User>;
  createProfile(data: CreateProfileInput): Promise<Profile>;
  createCustomer(data: CreateCustomerInput): Promise<Customer>;
  findAuthByEmail(email: string): Promise<{ id: number; email: string; passwordHash: string; role: UserRole } | null>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  findByIdWithRelations(id: number): Promise<User | null>;
  updatePassword(userId: number, passwordHash: string): Promise<void>;
}
