import { api, setCookie, deleteCookie } from '~/lib/axios';
import type { AuthUserParams, AuthUserResponse, CreateUserParams, CreateUserResponse } from "~/types/services";

/**
 * Realiza login com email e senha
 * Retorna token JWT e dados do usuário
 */
export async function login(params: AuthUserParams): Promise<AuthUserResponse> {
  try {
    const { data } = await api.post<AuthUserResponse>('/auth/login', params);
    
    // Armazena o token em cookie seguro (lado cliente)
    if (data.result?.token && typeof window !== 'undefined') {
      setCookie('authToken', data.result.token, 7); // 7 dias
      
      // Armazena username também (usa email como fallback)
      const username = (data.result as any)?.username || (data.result as any)?.email || params.email;
      setCookie('username', username, 7);
    }
    
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