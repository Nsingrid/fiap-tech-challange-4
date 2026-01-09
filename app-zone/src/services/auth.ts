import { api, deleteCookie } from '~/lib/axios';
import type { AuthUserParams, AuthUserResponse, CreateUserParams, CreateUserResponse } from "~/types/services";

/**
 * Realiza login com email e senha
 * Retorna token JWT e dados do usuário
 */
export async function login(params: AuthUserParams): Promise<AuthUserResponse> {
  try {
    const { data } = await api.post<AuthUserResponse>('/auth/login', params);
    
    // O cookie é setado automaticamente pelo backend via Set-Cookie header
    // Não precisamos setar manualmente aqui, pois:
    // 1. O authToken é httpOnly (não acessível via JS)
    // 2. O username também é setado pelo backend
    // A duplicação causava conflitos de cookies
    
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Falha ao fazer login');
  }
}

/**
 * Registra um novo usuário
 */
export async function signup(params: CreateUserParams): Promise<CreateUserResponse> {
  try {
    const { data } = await api.post<CreateUserResponse>('/users', params);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Falha ao registrar');
  }
}

/**
 * Faz logout do usuário
 */
export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
  } finally {
    // Remove cookies no cliente
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