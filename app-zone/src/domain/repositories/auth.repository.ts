/**
 * Domain Repository Interface: Authentication
 * Define o contrato para operações de autenticação
 */

import type { User, UserCredentials, AuthToken } from '../entities/user.entity';

export interface IAuthRepository {
  login(credentials: UserCredentials): Promise<{ user: User; token: AuthToken }>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  refreshToken(): Promise<AuthToken>;
  validateToken(token: string): Promise<boolean>;
}
