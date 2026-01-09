import helmet from 'helmet';
import { Express } from 'express';

/**
 * Configura middlewares de segurança usando Helmet
 * Protege contra vulnerabilidades web comuns
 */
export function setupSecurityMiddlewares(app: Express): void {
  // Helmet com configurações personalizadas
  app.use(
    helmet({
      // Content Security Policy - Desabilitado para APIs
      contentSecurityPolicy: false,
      // Previne clickjacking
      frameguard: {
        action: 'deny',
      },
      // Remove header X-Powered-By
      hidePoweredBy: true,
      // Força HTTPS apenas em produção
      hsts: process.env.NODE_ENV === 'production' ? {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      } : false,
      // Previne MIME type sniffing
      noSniff: true,
      // Configura Referrer Policy
      referrerPolicy: {
        policy: 'strict-origin-when-cross-origin',
      },
      // XSS Protection (fallback para browsers antigos)
      xssFilter: true,
      // Permite CORS
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );
}
