/**
 * Transaction Service - Camada de serviço para transações
 */

import { GetUserTransactionsUseCase } from '~/domain/usecases/get-user-transactions.usecase';
import { transactionRepository } from '~/infrastructure/http/transaction.repository';
import { reactiveState } from '~/infrastructure/state/reactive-state.service';
import { cacheService } from '~/utils/cache';
import { clearEndpointCache } from '~/lib/axios';
import type { Transaction } from '~/domain/usecases/get-user-transactions.usecase';

class TransactionService {
  private getTransactionsUseCase: GetUserTransactionsUseCase;

  constructor() {
    this.getTransactionsUseCase = new GetUserTransactionsUseCase(transactionRepository);
  }

  /**
   * Busca transações do usuário
   */
  async getTransactions(useCache: boolean = true): Promise<Transaction[]> {
    try {
      reactiveState.setLoading(true);
      reactiveState.clearError();

      const transactions = await this.getTransactionsUseCase.execute(useCache);
      
      // Atualiza estado reativo
      reactiveState.setTransactions(transactions);
      reactiveState.setLoading(false);

      return transactions;
    } catch (error: any) {
      reactiveState.setError(error.message);
      reactiveState.setLoading(false);
      throw error;
    }
  }

  /**
   * Busca transações com filtro de período
   */
  async getTransactionsWithFilter(
    period: 'last7' | 'last30' | 'last90' | 'all',
    useCache: boolean = true
  ): Promise<Transaction[]> {
    try {
      reactiveState.setLoading(true);
      reactiveState.clearError();

      const transactions = await this.getTransactionsUseCase.executeWithFilter(period, useCache);
      
      reactiveState.setTransactions(transactions);
      reactiveState.setLoading(false);

      return transactions;
    } catch (error: any) {
      reactiveState.setError(error.message);
      reactiveState.setLoading(false);
      throw error;
    }
  }

  /**
   * Obtém estatísticas
   */
  async getStatistics(useCache: boolean = true) {
    try {
      return await this.getTransactionsUseCase.getStatistics(useCache);
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      throw error;
    }
  }

  /**
   * Cria nova transação
   */
  async createTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    try {
      reactiveState.setLoading(true);
      reactiveState.clearError();

      const newTransaction = await transactionRepository.createTransaction(transaction);
      
      // Adiciona ao estado reativo
      reactiveState.addTransaction(newTransaction);
      
      // Limpa cache do axios
      await clearEndpointCache([
        '/account', 
        '/statement', 
        '/investments/transactions',
        '/investments/catalog'
      ]);
      
      // Invalida cache local para forçar atualização
      await Promise.all([
        cacheService.remove('user_transactions'),
        cacheService.remove('user_account'),
        cacheService.remove('investment_transactions'),
        cacheService.remove('investment_catalog'),
      ]);
      
      reactiveState.setLoading(false);

      return newTransaction;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      reactiveState.setError(message);
      reactiveState.setLoading(false);
      throw error;
    }
  }
}

export const transactionService = new TransactionService();
