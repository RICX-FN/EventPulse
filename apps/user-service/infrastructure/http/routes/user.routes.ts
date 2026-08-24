import { Router } from 'express';
import { PrismaUserRepository } from '../../database/repositories/prisma-user-repository';
import { RegisterUserUseCase } from '../../../use-cases/register-user';
import { AuthenticateUserUseCase } from '../../../use-cases/authenticate-user';
import { RegisterController } from '../controllers/register.controller';
import { AuthenticateController } from '../controllers/authenticate.controller';

const userRoutes = Router();

const userRepository = new PrismaUserRepository();

const registerUserUseCase = new RegisterUserUseCase(userRepository);
const registerController = new RegisterController(registerUserUseCase);

const authenticateUserUseCase = new AuthenticateUserUseCase(userRepository);
const authenticateController = new AuthenticateController(authenticateUserUseCase);

userRoutes.post('/users/register', (req, res) => registerController.handle(req, res));
userRoutes.post('/users/login', (req, res) => authenticateController.handle(req, res));

export { userRoutes };