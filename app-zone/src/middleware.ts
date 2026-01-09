import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { securityMiddleware } from "~/infrastructure/security/security.middleware";

// Rotas públicas que não requerem autenticação
const PUBLIC_ROUTES = ["/", "/login"];

// Rotas protegidas que requerem autenticação
const PROTECTED_ROUTES = ["/dashboard", "/investimentos"];

export function middleware(request: NextRequest) {
  // Aplica middleware de segurança primeiro
  const securityResponse = securityMiddleware(request);
  if (securityResponse.status !== 200) {
    return securityResponse;
  }

  const token = request.cookies.get("authToken")?.value;
  const pathname = request.nextUrl.pathname;

  // Se está na raiz e tem token, redireciona para dashboard
  if (pathname === "/" && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Verificar se é uma rota protegida
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // Se é rota protegida e não tem token, redireciona para login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Se está autenticado e tenta acessar /login, redireciona para dashboard
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Passa a requisição adiante com headers de segurança
  const response = NextResponse.next();

  // Adiciona headers úteis para o resto da aplicação
  if (token) {
    response.headers.set("x-user-token", token);
  }

  // Headers de segurança adicionais
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-XSS-Protection", "1; mode=block");

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
