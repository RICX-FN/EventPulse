import { User } from '../../domain/entities/user';
import { UserRepository } from '../../domain/repositories/user-repository';

export class InMemoryUserRepository implements UserRepository {
  public items: User[] = [];

  async create(user: User): Promise<void> {
    this.items.push(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((item) => item.email === email);
    return user || null;
  }

  async findById(id: string): Promise<User | null> {
    const user = this.items.find((item) => item.id === id);
    return user || null;
  }
}