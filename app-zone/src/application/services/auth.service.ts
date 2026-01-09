/**
 * Auth Service - Camada de serviço que integra use cases e repositories
 * Implementa Facade Pattern para simplificar acesso à lógica de negócio
 */

import { AuthenticateUserUseCase } from '~/domain/usecases/authenticate-user.usecase';
import { authRepository } from '~/infrastructure/http/auth.repository';
import { reactiveState } from '~/infrastructure/state/reactive-state.service';
import type { AuthUserParams, CreateUserParams } from '~/types/services';

class AuthService {
  private authenticateUseCase: AuthenticateUserUseCase;

  constructor() {
    this.authenticateUseCase = new AuthenticateUserUseCase(authRepository);
  }

  /**
   * Realiza login com autenticação segura
   */
  async login(params: AuthUserParams): Promise<void> {
    try {
      reactiveState.setLoading(true);
      reactiveState.clearError();

      const response = await this.authenticateUseCase.execute(params);

      if (response.result) {
        // Atualiza estado reativo
        const result = response.result as { id?: string; username?: string };
        reactiveState.setUser({
          id: result.id || '1',
          name: result.username || params.email,
          email: params.email,
        });
      }

      reactiveState.setLoading(false);
    } catch (error: any) {
      reactiveState.setError(error.message);
      reactiveState.setLoading(false);
      throw error;
    }
  }

  /**
   * Registra novo usuário
   */
  async signup(params: CreateUserParams): Promise<void> {
    try {
      reactiveState.setLoading(true);
      reactiveState.clearError();

      await authRepository.signup(params);

      reactiveState.setLoading(false);
    } catch (error: any) {
      reactiveState.setError(error.message);
      reactiveState.setLoading(false);
      throw error;
    }
  }

  /**
   * Faz logout e limpa estado
   */
  async logout(): Promise<void> {
    try {
      await authRepository.logout();
      reactiveState.reset();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  }

  /**
   * Verifica se está autenticado
   */
  isAuthenticated(): boolean {
    return authRepository.isAuthenticated();
  }

  /**
   * Obtém token atual
   */
  getToken(): string | null {
    return authRepository.getToken();
  }
}

export const authService = new AuthService();
