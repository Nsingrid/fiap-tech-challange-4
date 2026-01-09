/**
 * Domain Entity: Account
 * Representa a entidade de conta bancária no domínio
 */

export interface Account {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AccountStatement {
  accountId: string;
  transactions: Transaction[];
  balance: number;
}

export interface Transaction {
  id: string;
  accountId: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
  amount: number;
  description: string;
  date: Date;
  balanceAfter: number;
}

export interface CreateTransactionDTO {
  type: 'DEPOSIT' | 'WITHDRAWAL';
  amount: number;
  description: string;
}
