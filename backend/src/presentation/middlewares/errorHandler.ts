import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../shared/errors/AppError';
import { ZodError } from 'zod';

/**
 * Middleware centralizado de tratamento de erros
 * Padroniza respostas de erro e registra logs apropriados
 */
export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): Response {
  // Erro operacional esperado (AppError)
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
      result: null,
      ...(error.details && { details: error.details }),
    });
  }

  // Erro de validação Zod
  if (error instanceof ZodError) {
    const errors = error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    return res.status(400).json({
      message: 'Validation error',
      result: null,
      details: errors,
    });
  }

  // Erros do Prisma
  if (error.constructor.name === 'PrismaClientKnownRequestError') {
    const prismaError = error as any;
    
    // Violação de constraint única
    if (prismaError.code === 'P2002') {
      return res.status(409).json({
        message: 'Resource already exists',
        result: null,
        details: { field: prismaError.meta?.target },
      });
    }

    // Registro não encontrado
    if (prismaError.code === 'P2025') {
      return res.status(404).json({
        message: 'Resource not found',
        result: null,
      });
    }
  }

  // Log de erros não tratados
  console.error('❌ Unhandled Error:', {
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    timestamp: new Date().toISOString(),
  });

  // Erro interno do servidor
  return res.status(500).json({
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message,
    result: null,
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack }),
  });
}
