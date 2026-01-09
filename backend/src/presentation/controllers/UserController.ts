import { Request, Response } from 'express';
import { CreateUserUseCase } from '../../domain/use-cases/CreateUserUseCase';
import { AuthenticateUserUseCase } from '../../domain/use-cases/AuthenticateUserUseCase';
import { PrismaUserRepository } from '../../infrastructure/repositories/PrismaUserRepository';
import { PrismaAccountRepository } from '../../infrastructure/repositories/PrismaAccountRepository';
import { JWTService } from '../../infrastructure/services/JWTService';
import { ServiceResponse } from '../../shared/types/ServiceResponse';
import { CreateUserInput, LoginInput } from '../../shared/validators/schemas';
import { AppError } from '../../shared/errors/AppError';
import bcrypt from 'bcryptjs';

const userRepository = new PrismaUserRepository();
const accountRepository = new PrismaAccountRepository();
const jwtService = new JWTService();

/**
 * Controller responsável por operações relacionadas a usuários
 * React Query gerencia cache no frontend
 */
export class UserController {
  async create(req: Request, res: Response): Promise<Response> {
    const data = req.body as CreateUserInput;

    const createUserUseCase = new CreateUserUseCase(userRepository, accountRepository);
    const user = await createUserUseCase.execute(data);

    const response: ServiceResponse = {
      message: 'User created successfully',
      result: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };

    return res.status(201).json(response);
  }

  async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body as LoginInput;

    const authenticateUserUseCase = new AuthenticateUserUseCase(userRepository);
    const result = await authenticateUserUseCase.execute({ email, password });

    // Buscar usuário completo para verificar senha
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Verificar senha
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    // Gerar token
    const token = jwtService.generateToken({
      userId: user.id,
      email: user.email,
    });

    // Configurar cookies httpOnly e secure
    // Em produção com domínios diferentes, usamos sameSite: 'none' + secure: true
    // Em desenvolvimento, usamos sameSite: 'lax'
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' as const : 'lax' as const,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
      path: '/',
    };

    res.cookie('authToken', token, cookieOptions);

    res.cookie('username', user.username, {
      ...cookieOptions,
      httpOnly: false, // username precisa ser acessível no cliente
    });

    const response: ServiceResponse = {
      message: 'Authentication successful',
      result: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      },
    };

    return res.json(response);
  }

  async logout(req: Request, res: Response): Promise<Response> {
    // clearCookie deve usar as mesmas opções do set cookie para funcionar
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' as const : 'lax' as const,
      path: '/',
    };

    res.clearCookie('authToken', cookieOptions);
    res.clearCookie('username', { ...cookieOptions, httpOnly: false });

    const response: ServiceResponse = {
      message: 'Logout successful',
    };

    return res.json(response);
  }

  async list(req: Request, res: Response): Promise<Response> {
    // Busca direta do banco - React Query gerencia cache no frontend
    const users = await userRepository.list();

    const result = users.map((user) => ({
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    }));

    const response: ServiceResponse = {
      message: 'Users retrieved successfully',
      result,
    };

    return res.json(response);
  }
}
