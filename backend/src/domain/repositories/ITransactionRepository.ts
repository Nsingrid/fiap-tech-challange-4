import { Transaction, CreateTransactionDTO } from '../entities/Transaction';

export interface ITransactionRepository {
  create(data: CreateTransactionDTO): Promise<Transaction>;
  findById(id: string): Promise<Transaction | null>;
  findByAccountId(accountId: string): Promise<Transaction[]>;
  findByAccountIdAndInvestmentCategory(accountId: string): Promise<Transaction[]>;
  delete(id: string): Promise<void>;
}
