import { api, deleteCookie } from '~/lib/axios';
import type { AuthUserParams, AuthUserResponse, CreateUserParams, CreateUserResponse } from "~/types/services";

/**
 * Realiza login com email e senha
 * Usa a API route local do Next.js para que o cookie seja setado no mesmo domínio
 */
export async function login(params: AuthUserParams): Promise<AuthUserResponse> {
  try {
    // Chama a API route local do Next.js (não o backend diretamente)
    // Isso garante que o cookie seja setado no domínio do frontend
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Falha ao fazer login' }));
      throw new Error(error.message || 'Falha ao fazer login');
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Falha ao fazer login');
  }
}

/**
 * Registra um novo usuário
 * Usa a API route local do Next.js para consistência
 */
export async function signup(params: CreateUserParams): Promise<CreateUserResponse> {
  try {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Falha ao registrar' }));
      throw new Error(error.message || 'Falha ao registrar');
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Falha ao registrar');
  }
}

/**
 * Faz logout do usuário
 * Usa a API route local do Next.js para remover os cookies corretamente
 */
export async function logout(): Promise<void> {
  try {
    // Chama a API route local do Next.js para remover cookies server-side
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
  } finally {
    // Remove cookies no cliente também (backup)
    deleteCookie('authToken');
    deleteCookie('username');
  }
}

/**
 * Verifica se o usuário está autenticado
 */
export async function verifyAuth(token: string): Promise<boolean> {
  try {
    await api.get('/auth/verify', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return true;
  } catch {
    return false;
  }
}