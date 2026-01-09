/**
 * Use Case: Authenticate User
 * Responsável por realizar autenticação seguindo Clean Architecture
 */

import { cryptoService } from '~/infrastructure/security/crypto.service';
import type { AuthUserParams, AuthUserResponse } from '~/types/services';

export interface IAuthRepository {
  login(params: AuthUserParams): Promise<AuthUserResponse>;
}

export class AuthenticateUserUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(params: AuthUserParams): Promise<AuthUserResponse> {
    // Validação de entrada
    if (!params.email || !params.password) {
      throw new Error('Email e senha são obrigatórios');
    }

    // Validação de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(params.email)) {
      throw new Error('Email inválido');
    }

    // Criptografa senha antes de enviar (segurança adicional)
    const encryptedPassword = await cryptoService.hash(params.password);

    try {
      const response = await this.authRepository.login({
        email: params.email,
        password: encryptedPassword,
      });

      // Validação de resposta
      if (!response.result?.token) {
        throw new Error('Resposta inválida do servidor');
      }

      return response;
    } catch (error: any) {
      // Log de erro (pode ser integrado com sistema de monitoramento)
      console.error('AuthenticateUserUseCase error:', error);
      throw error;
    }
  }
}
