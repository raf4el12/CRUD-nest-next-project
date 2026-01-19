import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import {
  CreateCustomerInput,
  CreateProfileInput,
  CreateUserInput,
  UserRepository,
} from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { Profile } from '../../domain/entities/profile.entity';
import { Customer } from '../../domain/entities/customer.entity';
import { Customers, Profiles, Users } from '@prisma/client';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: CreateUserInput): Promise<User> {
    const created = await this.prisma.users.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        role: data.role ?? undefined,
      },
    });

    return this.toDomainUser(created);
  }

  async createProfile(data: CreateProfileInput): Promise<Profile> {
    const created = await this.prisma.profiles.create({
      data: {
        userId: data.userId,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone ?? null,
        photo: data.photo ?? null,
        documentType: data.documentType ?? undefined,
        documentNumber: data.documentNumber ?? null,
      },
    });

    return this.toDomainProfile(created);
  }

  async createCustomer(data: CreateCustomerInput): Promise<Customer> {
    const created = await this.prisma.customers.create({
      data: {
        userId: data.userId,
        shippingAddress: data.shippingAddress ?? null,
        billingAddress: data.billingAddress ?? null,
      },
    });

    return this.toDomainCustomer(created);
  }

  async findAuthByEmail(email: string): Promise<{
    id: number;
    email: string;
    passwordHash: string;
    role: Users['role'];
  } | null> {
    const found = await this.prisma.users.findFirst({
      where: { email, deletedAt: null },
      select: { id: true, email: true, passwordHash: true, role: true },
    });

    return found ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const found = await this.prisma.users.findFirst({
      where: { email, deletedAt: null },
      include: { profile: true, customer: true },
    });

    return found
      ? this.toDomainUser(found, found.profile, found.customer)
      : null;
  }

  async findById(id: number): Promise<User | null> {
    const found = await this.prisma.users.findFirst({
      where: { id, deletedAt: null },
    });

    return found ? this.toDomainUser(found) : null;
  }

  async findByIdWithRelations(id: number): Promise<User | null> {
    const found = await this.prisma.users.findFirst({
      where: { id, deletedAt: null },
      include: { profile: true, customer: true },
    });

    return found
      ? this.toDomainUser(found, found.profile, found.customer)
      : null;
  }

  async updatePassword(userId: number, passwordHash: string): Promise<void> {
    await this.prisma.users.update({
      where: { id: userId },
      data: { passwordHash },
    });
  }

  private toDomainUser(
    user: Users,
    profile?: Profiles | null,
    customer?: Customers | null,
  ): User {
    return new User(
      user.id,
      user.email,
      user.role,
      user.emailVerified,
      user.deletedAt ?? null,
      user.createdAt,
      user.updatedAt,
      profile ? this.toDomainProfile(profile) : null,
      customer ? this.toDomainCustomer(customer) : null,
    );
  }

  private toDomainProfile(profile: Profiles): Profile {
    return new Profile(
      profile.id,
      profile.userId,
      profile.firstName,
      profile.lastName,
      profile.phone ?? null,
      profile.photo ?? null,
      profile.documentType ?? null,
      profile.documentNumber ?? null,
      profile.createdAt,
      profile.updatedAt,
    );
  }

  private toDomainCustomer(customer: Customers): Customer {
    return new Customer(
      customer.id,
      customer.userId,
      customer.points,
      customer.level,
      customer.newsletter,
      customer.shippingAddress ?? null,
      customer.billingAddress ?? null,
      customer.createdAt,
      customer.updatedAt,
    );
  }
}
