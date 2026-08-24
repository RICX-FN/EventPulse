import { Request, Response } from 'express';
import { AuthenticateUserUseCase } from '../../../use-cases/authenticate-user';

export class AuthenticateController {
  constructor(private authenticateUserUseCase: AuthenticateUserUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password.' });
    }

    try {
      const { token } = await this.authenticateUserUseCase.execute({
        email,
        password,
      });

      return res.status(200).json({ token });
    } catch (error: any) {
      return res.status(401).json({ error: error.message });
    }
  }
}