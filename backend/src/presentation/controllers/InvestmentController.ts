import { Request, Response } from 'express';
import { InvestmentCatalog, getInvestmentNameByCode } from '../../domain/entities/InvestmentCatalog';
import { TransactionType } from '../../domain/entities/Transaction';
import { ServiceResponse } from '../../shared/types/ServiceResponse';
import { PrismaTransactionRepository } from '../../infrastructure/repositories/PrismaTransactionRepository';
import { PrismaAccountRepository } from '../../infrastructure/repositories/PrismaAccountRepository';
import { AuthRequest } from '../middlewares/authMiddleware';

const transactionRepository = new PrismaTransactionRepository();
const accountRepository = new PrismaAccountRepository();

export class InvestmentController {
  async getCatalog(req: Request, res: Response): Promise<Response> {
    const response: ServiceResponse = {
      message: 'Investment catalog retrieved successfully',
      result: InvestmentCatalog,
    };

    return res.json(response);
  }

  async getInvestmentTransactions(req: AuthRequest, res: Response): Promise<Response> {
    const userId = req.userId!;

    // Buscar conta do usuário
    const account = await accountRepository.findByUserId(userId);
    if (!account) {
      return res.status(404).json({
        message: 'Account not found',
        result: null,
      });
    }

    // Buscar transações com investmentCategory não nulo
    const transactions = await transactionRepository.findByAccountIdAndInvestmentCategory(account.id);

    // Calcular total investido por categoria de investimento
    const investmentTotals: Record<string, number> = {};

    transactions.forEach((transaction) => {
      if (!transaction.investmentCategory) return;

      const investmentName = getInvestmentNameByCode(transaction.investmentCategory);
      if (!investmentName) return;

      const value = Number(transaction.value);

      if (!investmentTotals[investmentName]) {
        investmentTotals[investmentName] = 0;
      }

      // Credit = investimento (entrada), Debit = resgate (saída)
      if (transaction.type === TransactionType.Credit) {
        investmentTotals[investmentName] += value;
      } else if (transaction.type === TransactionType.Debit) {
        investmentTotals[investmentName] -= value;
      }
    });

    // Converter para array de objetos
    const investmentSummary = Object.entries(investmentTotals)
      .map(([name, total]) => ({
        investmentType: name,
        totalInvested: total,
      }))
      .filter((item) => item.totalInvested !== 0) // Remover investimentos com saldo zero
      .sort((a, b) => Math.abs(b.totalInvested) - Math.abs(a.totalInvested)); // Ordenar por maior valor absoluto

    const response: ServiceResponse = {
      message: 'Investment transactions retrieved successfully',
      result: {
        transactions: transactions.map((t) => ({
          id: t.id,
          accountId: t.accountId,
          type: t.type,
          value: Number(t.value),
          date: t.date,
          category: t.category,
          investmentCategory: getInvestmentNameByCode(t.investmentCategory),
        })),
        investmentSummary,
      },
    };

    return res.json(response);
  }
}
