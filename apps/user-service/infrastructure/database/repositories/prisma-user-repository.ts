import prisma from '../prisma';
import { User } from '../../../src/domain/entities/user';
import { UserRepository } from '../../../src/domain/repositories/user-repository';

export class PrismaUserRepository implements UserRepository {
  async create(user: User): Promise<void> {
    await prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const rawUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!rawUser) return null;

    return new User({
      id: rawUser.id,
      name: rawUser.name,
      email: rawUser.email,
      password: rawUser.password,
      role: rawUser.role as 'USER' | 'ADMIN',
      createdAt: rawUser.createdAt,
      updatedAt: rawUser.updatedAt,
    });
  }

  async findById(id: string): Promise<User | null> {
    const rawUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!rawUser) return null;

    return new User({
      id: rawUser.id,
      name: rawUser.name,
      email: rawUser.email,
      password: rawUser.password,
      role: rawUser.role as 'USER' | 'ADMIN',
      createdAt: rawUser.createdAt,
      updatedAt: rawUser.updatedAt,
    });
  }
}