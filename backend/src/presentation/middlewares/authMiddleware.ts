import { Request, Response, NextFunction } from 'express';
import { JWTService } from '../../infrastructure/services/JWTService';
import { AppError } from '../../shared/errors/AppError';

const jwtService = new JWTService();

export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
}

export async function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // Verificar token no cookie
    const token = req.cookies?.authToken;

    if (!token) {
      throw new AppError('Token not provided', 401);
    }

    // Verificar e decodificar token
    const decoded = jwtService.verifyToken(token);

    // Adicionar informações do usuário ao request
    req.userId = decoded.userId;
    req.userEmail = decoded.email;

    next();
  } catch (error) {
    next(new AppError('Invalid token', 401));
  }
}
