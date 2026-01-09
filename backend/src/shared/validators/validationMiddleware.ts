import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from '../errors/AppError';

/**
 * Middleware genérico de validação usando Zod
 * Valida body, query params ou params da requisição
 */
export function validateRequest(schema: ZodSchema, property: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req[property]);
      req[property] = validated;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        next(
          new AppError(
            'Validation error',
            400,
            errors,
          ),
        );
      } else {
        next(new AppError('Validation error', 400));
      }
    }
  };
}
