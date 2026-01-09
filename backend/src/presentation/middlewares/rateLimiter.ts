import rateLimit from 'express-rate-limit';

/**
 * Rate limiter global para todas as rotas
 * Previne ataques de força bruta e DDoS
 */
export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limite de 100 requisições por IP
  message: {
    message: 'Too many requests from this IP, please try again later.',
    result: null,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter específico para rotas de autenticação
 * Mais restritivo para prevenir ataques de força bruta
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Apenas 5 tentativas de login
  message: {
    message: 'Too many login attempts, please try again after 15 minutes.',
    result: null,
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Não conta requisições bem-sucedidas
});

/**
 * Rate limiter para operações de criação
 * Previne spam e abuso
 */
export const createRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 10, // 10 criações por minuto
  message: {
    message: 'Too many creation requests, please slow down.',
    result: null,
  },
  standardHeaders: true,
  legacyHeaders: false,
});
