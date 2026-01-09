/**
 * Tipos Globais da Aplicação
 * Centralize todos os tipos compartilhados aqui
 */

// ============================================
// Autenticação
// ============================================

export interface AuthUser {
  id: string;
  username: string;
  email: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user?: AuthUser;
}

// ============================================
// Contas
// ============================================

export interface Account {
  id: string;
  accountNumber: string;
  accountType: 'CHECKING' | 'SAVINGS';
  balance: number; // em centavos
}

// ============================================
// Transações
// ============================================

export type TransactionType = 'Credit' | 'Debit';

export interface Transaction {
  id: string;
  accountId: string;
  type: TransactionType;
  value: number; // em centavos
  date: string;
  from?: string;
  to?: string;
  anexo?: string | null;
}

export interface CreateTransactionDTO {
  type: TransactionType;
  value: number;
  from?: string;
  to?: string;
  anexo?: string;
}

// ============================================
// API Responses
// ============================================

export interface ApiResponse<T> {
  message: string;
  result?: T;
  error?: string;
}

export interface LoginResponse extends ApiResponse<AuthResponse> {}

export interface SignupResponse extends ApiResponse<AuthUser> {}

export interface AccountResponse extends ApiResponse<{
  account: Account;
  cards: any[];
  transactions: Transaction[];
}> {}

export interface StatementResponse extends ApiResponse<{
  transactions: Transaction[];
}> {}

// ============================================
// UI Components
// ============================================

export interface LoadingState {
  loading: boolean;
  error: string | null;
}

export interface AsyncState<T> extends LoadingState {
  data: T | null;
}

// ============================================
// Utilitários
// ============================================

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}
