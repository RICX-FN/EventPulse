import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { UserRepository } from '../src/domain/repositories/user-repository';

interface AuthenticateUserRequest {
  email: string;
  password: string;
}

interface AuthenticateUserResponse {
  token: string;
}

export class AuthenticateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({ email, password }: AuthenticateUserRequest): Promise<AuthenticateUserResponse> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error('Invalid credentials.');
    }

    const doesPasswordMatch = await compare(password, user.password);

    if (!doesPasswordMatch) {
      throw new Error('Invalid credentials.');
    }

    const secret = process.env.JWT_SECRET || 'default-secret-key';

    const token = sign(
      { role: user.role },
      secret,
      {
        subject: user.id,
        expiresIn: '1d',
      }
    );

    return { token };
  }
}