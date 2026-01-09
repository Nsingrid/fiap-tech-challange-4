/**
 * Security Middleware - Proteções adicionais de segurança
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rate limiting simples (em produção, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Lista de IPs bloqueados (em produção, use banco de dados)
const blockedIPs = new Set<string>();

// Rotas sensíveis que requerem rate limiting mais restrito
const SENSITIVE_ROUTES = ['/api/auth/login', '/api/auth/signup', '/api/transactions'];

/**
 * Implementa rate limiting básico
 */
function checkRateLimit(ip: string, path: string): boolean {
  const now = Date.now();
  const limit = SENSITIVE_ROUTES.some(route => path.startsWith(route)) ? 5 : 30;
  const windowMs = 60 * 1000; // 1 minuto

  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (entry.count >= limit) {
    return false;
  }

  entry.count++;
  return true;
}

/**
 * Valida token JWT básico (sem biblioteca externa)
 */
function isValidTokenFormat(token: string): boolean {
  // JWT tem 3 partes separadas por pontos
  const parts = token.split('.');
  if (parts.length !== 3) return false;

  // Cada parte deve ser base64
  try {
    parts.forEach(part => {
      if (typeof window === 'undefined') {
        Buffer.from(part, 'base64');
      } else {
        atob(part);
      }
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Detecta tentativas de SQL Injection ou XSS
 */
function hasSuspiciousPatterns(value: string): boolean {
  const suspiciousPatterns = [
    /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,  // SQL injection
    /<script[\s\S]*?>[\s\S]*?<\/script>/gi,  // XSS
    /javascript:/gi,  // XSS
    /on\w+\s*=/gi,  // Event handlers (XSS)
  ];

  return suspiciousPatterns.some(pattern => pattern.test(value));
}

export function securityMiddleware(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown';
  const pathname = request.nextUrl.pathname;
  const searchParams = request.nextUrl.searchParams;

  // 1. Verifica se IP está bloqueado
  if (blockedIPs.has(ip)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // 2. Rate limiting
  if (!checkRateLimit(ip, pathname)) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': '60',
        'X-RateLimit-Limit': '30',
        'X-RateLimit-Remaining': '0',
      },
    });
  }

  // 3. Valida query parameters para SQL injection/XSS
  for (const [key, value] of searchParams.entries()) {
    if (hasSuspiciousPatterns(value)) {
      console.warn(`Suspicious pattern detected from ${ip}: ${key}=${value}`);
      return new NextResponse('Bad Request', { status: 400 });
    }
  }

  // 4. Valida formato do token em rotas protegidas
  const token = request.cookies.get('authToken')?.value;
  const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/investimentos');

  if (isProtectedRoute && token && !isValidTokenFormat(token)) {
    console.warn(`Invalid token format from ${ip}`);
    
    // Remove cookie inválido
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('authToken');
    response.cookies.delete('username');
    return response;
  }

  // 5. Adiciona headers de segurança
  const response = NextResponse.next();
  
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  // Content Security Policy (CSP)
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
  );

  return response;
}
