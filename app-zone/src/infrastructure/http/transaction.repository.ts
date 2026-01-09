/**
 * Transaction Repository Implementation
 */

import { api } from '~/lib/axios';
import type { ITransactionRepository, Transaction } from '~/domain/usecases/get-user-transactions.usecase';

export class TransactionRepository implements ITransactionRepository {
  /**
   * Busca todas as transações do usuário
   */
  async getTransactions(): Promise<Transaction[]> {
    try {
      const { data } = await api.get<{ result: Transaction[] }>('/transactions');
      return data.result || [];
    } catch (error: any) {
      console.error('Erro ao buscar transações:', error);
      throw new Error(error.response?.data?.message || 'Falha ao buscar transações');
    }
  }

  /**
   * Cria nova transação
   */
  async createTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    try {
      const { data } = await api.post<{ result: Transaction }>('/transactions', transaction);
      return data.result;
    } catch (error: any) {
      console.error('Erro ao criar transação:', error);
      throw new Error(error.response?.data?.message || 'Falha ao criar transação');
    }
  }

  /**
   * Busca transação por ID
   */
  async getTransactionById(id: string): Promise<Transaction> {
    try {
      const { data } = await api.get<{ result: Transaction }>(`/transactions/${id}`);
      return data.result;
    } catch (error: any) {
      console.error('Erro ao buscar transação:', error);
      throw new Error(error.response?.data?.message || 'Falha ao buscar transação');
    }
  }

  /**
   * Deleta transação
   */
  async deleteTransaction(id: string): Promise<void> {
    try {
      await api.delete(`/transactions/${id}`);
    } catch (error: any) {
      console.error('Erro ao deletar transação:', error);
      throw new Error(error.response?.data?.message || 'Falha ao deletar transação');
    }
  }
}

// Instância singleton
export const transactionRepository = new TransactionRepository();
