/**
 * Domain Entity: User
 * Representa a entidade de usuário no domínio da aplicação
 */

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
}

export interface UserCredentials {
  username: string;
  password: string;
}

export interface AuthToken {
  token: string;
  expiresAt: Date;
}
