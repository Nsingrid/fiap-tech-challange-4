import { ITransactionRepository } from '../../domain/repositories/ITransactionRepository';
import { Transaction, CreateTransactionDTO } from '../../domain/entities/Transaction';
import { prisma } from '../database/prisma';

export class PrismaTransactionRepository implements ITransactionRepository {
  async create(data: CreateTransactionDTO): Promise<Transaction> {
    const transaction = await prisma.transaction.create({
      data,
    });

    return transaction as Transaction;
  }

  async findById(id: string): Promise<Transaction | null> {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    return transaction as Transaction | null;
  }

  async findByAccountId(accountId: string): Promise<Transaction[]> {
    const transactions = await prisma.transaction.findMany({
      where: { accountId },
      orderBy: { date: 'desc' },
    });

    return transactions as Transaction[];
  }

  async findByAccountIdAndInvestmentCategory(accountId: string): Promise<Transaction[]> {
    const transactions = await prisma.transaction.findMany({
      where: {
        accountId,
        investmentCategory: {
          not: null,
        },
      },
      orderBy: { date: 'desc' },
    });

    return transactions as Transaction[];
  }

  async delete(id: string): Promise<void> {
    await prisma.transaction.delete({
      where: { id },
    });
  }
}
