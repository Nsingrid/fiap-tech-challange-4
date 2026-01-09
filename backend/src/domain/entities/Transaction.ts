import { TransactionCategory } from './TransactionCategory';

export enum TransactionType {
  Credit = 'Credit',
  Debit = 'Debit',
}

export interface Transaction {
  id: string;
  accountId: string;
  type: TransactionType;
  value: bigint;
  date: Date;
  category: string;
  investmentCategory?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTransactionDTO {
  accountId: string;
  type: TransactionType;
  value: bigint;
  category: string;
  investmentCategory?: string | null;
}
