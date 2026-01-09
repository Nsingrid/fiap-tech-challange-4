/**
 * Domain Repository Interface: Account
 * Define o contrato para operações de conta
 */

import type { Account, AccountStatement, CreateTransactionDTO, Transaction } from '../entities/account.entity';

export interface IAccountRepository {
  getAccount(): Promise<Account>;
  getStatement(filters?: {
    startDate?: Date;
    endDate?: Date;
    type?: string;
  }): Promise<AccountStatement>;
  createTransaction(transaction: CreateTransactionDTO): Promise<Transaction>;
  getBalance(): Promise<number>;
}
