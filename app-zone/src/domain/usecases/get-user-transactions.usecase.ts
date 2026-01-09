/**
 * Use Case: Get User Transactions
 * Busca e processa transações do usuário
 */

import { cacheService } from '~/utils/cache';

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'transfer' | 'investment';
  amount: number;
  date: string;
  description: string;
}

export interface ITransactionRepository {
  getTransactions(): Promise<Transaction[]>;
}

export class GetUserTransactionsUseCase {
  constructor(private transactionRepository: ITransactionRepository) {}

  async execute(useCache: boolean = true): Promise<Transaction[]> {
    const cacheKey = 'user_transactions';

    // Tenta buscar do cache primeiro
    if (useCache) {
      const cached = await cacheService.get<Transaction[]>(cacheKey);
      if (cached) {
        return cached;
      }
    }

    try {
      // Busca do repositório
      const transactions = await this.transactionRepository.getTransactions();

      // Ordena por data (mais recente primeiro)
      const sorted = transactions.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      // Armazena no cache
      await cacheService.set(cacheKey, sorted, 5 * 60 * 1000); // 5 minutos

      return sorted;
    } catch (error) {
      console.error('GetUserTransactionsUseCase error:', error);
      throw error;
    }
  }

  /**
   * Filtra transações por período
   */
  async executeWithFilter(
    period: 'last7' | 'last30' | 'last90' | 'all',
    useCache: boolean = true
  ): Promise<Transaction[]> {
    const transactions = await this.execute(useCache);

    if (period === 'all') {
      return transactions;
    }

    const days = period === 'last7' ? 7 : period === 'last30' ? 30 : 90;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return transactions.filter(
      (t) => new Date(t.date) >= cutoffDate
    );
  }

  /**
   * Calcula estatísticas das transações
   */
  async getStatistics(useCache: boolean = true): Promise<{
    total: number;
    deposits: number;
    withdraws: number;
    balance: number;
  }> {
    const transactions = await this.execute(useCache);

    return transactions.reduce(
      (acc, t) => {
        acc.total += 1;
        if (t.type === 'deposit') {
          acc.deposits += t.amount;
          acc.balance += t.amount;
        } else if (t.type === 'withdraw') {
          acc.withdraws += t.amount;
          acc.balance -= t.amount;
        }
        return acc;
      },
      { total: 0, deposits: 0, withdraws: 0, balance: 0 }
    );
  }
}
