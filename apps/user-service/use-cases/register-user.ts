import { hash } from 'bcryptjs';
import { User } from '../src/domain/entities/user';
import { UserRepository } from '../src/domain/repositories/user-repository';

interface RegisterUserRequest {
  name: string;
  email: string;
  password: string;
}

interface RegisterUserResponse {
  user: User;
}

export class RegisterUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({ name, email, password }: RegisterUserRequest): Promise<RegisterUserResponse> {
    const userWithSameEmail = await this.userRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new Error('User with this email already exists.');
    }

    const passwordHash = await hash(password, 6);

    const user = new User({
      name,
      email,
      password: passwordHash,
    });

    await this.userRepository.create(user);

    return { user };
  }
}