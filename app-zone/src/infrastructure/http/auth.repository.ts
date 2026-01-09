/**
 * Auth Repository Implementation
 * Implementa a interface do repositório de autenticação
 */

import { api, setCookie, deleteCookie } from '~/lib/axios';
import type { AuthUserParams, AuthUserResponse, CreateUserParams, CreateUserResponse } from '~/types/services';
import type { IAuthRepository } from '~/domain/usecases/authenticate-user.usecase';

export class AuthRepository implements IAuthRepository {
  /**
   * Realiza login
   */
  async login(params: AuthUserParams): Promise<AuthUserResponse> {
    try {
      const { data } = await api.post<AuthUserResponse>('/auth/login', params);
      
      // Armazena o token em cookie seguro
      if (data.result?.token && typeof window !== 'undefined') {
        setCookie('authToken', data.result.token, 7); // 7 dias
        
        const username = (data.result as any)?.username || (data.result as any)?.email || params.email;
        setCookie('username', username, 7);
      }
      
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Falha ao fazer login');
    }
  }

  /**
   * Registra novo usuário
   */
  async signup(params: CreateUserParams): Promise<CreateUserResponse> {
    try {
      const { data } = await api.post<CreateUserResponse>('/users', params);
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Falha ao registrar');
    }
  }

  /**
   * Faz logout
   */
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      deleteCookie('authToken');
      deleteCookie('username');
    }
  }

  /**
   * Verifica se usuário está autenticado
   */
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('authToken='))
      ?.split('=')[1];
    
    return !!token;
  }

  /**
   * Obtém token atual
   */
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('authToken='))
      ?.split('=')[1];
    
    return token || null;
  }
}

// Instância singleton
export const authRepository = new AuthRepository();
