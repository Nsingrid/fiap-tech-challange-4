import { Request, Response } from 'express';
import { CreateTransactionUseCase } from '../../domain/use-cases/CreateTransactionUseCase';
import { GetTransactionsByAccountUseCase } from '../../domain/use-cases/GetTransactionsByAccountUseCase';
import { PrismaTransactionRepository } from '../../infrastructure/repositories/PrismaTransactionRepository';
import { PrismaAccountRepository } from '../../infrastructure/repositories/PrismaAccountRepository';
import { cacheService } from '../../infrastructure/services/CacheService';
import { TransactionType } from '../../domain/entities/Transaction';
import { CreditCategories, DebitCategories } from '../../domain/entities/TransactionCategory';
import { getInvestmentNameByCode } from '../../domain/entities/InvestmentCatalog';
import { ServiceResponse } from '../../shared/types/ServiceResponse';
import { AuthRequest } from '../middlewares/authMiddleware';
import { CreateTransactionInput } from '../../shared/validators/schemas';
import { AppError } from '../../shared/errors/AppError';

const transactionRepository = new PrismaTransactionRepository();
const accountRepository = new PrismaAccountRepository();

/**
 * Controller responsável por operações de transações
 * Cache apenas para dados estáticos - React Query gerencia cache no frontend
 */
export class TransactionController {
  async create(req: AuthRequest, res: Response): Promise<Response> {
    const userId = req.userId!;
    const data = req.body as CreateTransactionInput;

    // Buscar conta do usuário
    const account = await accountRepository.findByUserId(userId);
    if (!account) {
      throw new AppError('Account not found', 404);
    }

    const createTransactionUseCase = new CreateTransactionUseCase(
      transactionRepository,
      accountRepository,
    );

    const transaction = await createTransactionUseCase.execute({
      accountId: account.id,
      type: data.type as TransactionType,
      value: BigInt(data.value),
      category: data.category,
      investmentCategory: data.investmentCategory || null,
    });

    const response: ServiceResponse = {
      message: 'Transaction created successfully',
      result: {
        id: transaction.id,
        accountId: transaction.accountId,
        type: transaction.type,
        value: Number(transaction.value),
        date: transaction.date,
        category: transaction.category,
        investmentCategory: getInvestmentNameByCode(transaction.investmentCategory),
      },
    };

    return res.status(201).json(response);
  }

  async listByAccount(req: AuthRequest, res: Response): Promise<Response> {
    const userId = req.userId!;

    // Buscar conta do usuário
    const account = await accountRepository.findByUserId(userId);
    if (!account) {
      throw new AppError('Account not found', 404);
    }

    // Busca direta do banco - React Query gerencia cache no frontend
    const getTransactionsUseCase = new GetTransactionsByAccountUseCase(
      transactionRepository,
      accountRepository,
    );

    const transactions = await getTransactionsUseCase.execute(account.id);

    const result = {
      transactions: transactions.map((t) => ({
        id: t.id,
        accountId: t.accountId,
        type: t.type,
        value: Number(t.value),
        date: t.date,
        category: t.category,
        investmentCategory: getInvestmentNameByCode(t.investmentCategory),
      })),
    };

    const response: ServiceResponse = {
      message: 'Transactions retrieved successfully',
      result,
    };

    return res.json(response);
  }

  async getCategories(req: Request, res: Response): Promise<Response> {
    // Categorias são estáticas, cache por 1 hora
    const cacheKey = 'transaction:categories';
    const cachedCategories = cacheService.get<any>(cacheKey);

    if (cachedCategories) {
      return res.json({
        message: 'Categories retrieved successfully (cached)',
        result: cachedCategories,
      });
    }

    const result = {
      credit: CreditCategories,
      debit: DebitCategories,
    };

    cacheService.set(cacheKey, result, 3600);

    const response: ServiceResponse = {
      message: 'Categories retrieved successfully',
      result,
    };

    return res.json(response);
  }
}
