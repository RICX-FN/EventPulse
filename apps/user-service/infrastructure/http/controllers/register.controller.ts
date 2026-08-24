import { Request, Response } from 'express';
import { RegisterUserUseCase } from '../../../use-cases/register-user';

export class RegisterController {
  constructor(private registerUserUseCase: RegisterUserUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    try {
      const { user } = await this.registerUserUseCase.execute({
        name,
        email,
        password,
      });

      return res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}